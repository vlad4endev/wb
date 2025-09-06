import { BaseWBClient } from './base-client';
import { 
  WBCoefficient, 
  WBWarehouse, 
  WBSupply, 
  WBGood, 
  WBAcceptanceOptions,
  WBAPIResponse 
} from './types';

export class WBSuppliesClient extends BaseWBClient {
  constructor(token: string) {
    super(token, 'https://supplies-api.wildberries.ru');
  }

  /**
   * Get acceptance coefficients for warehouses
   * @param warehouseIds Array of warehouse IDs
   * @param dateFrom Start date (ISO string)
   * @param dateTo End date (ISO string)
   */
  async getCoefficients(
    warehouseIds: number[],
    dateFrom?: string,
    dateTo?: string
  ): Promise<WBCoefficient[]> {
    const params: Record<string, any> = {
      warehouseIds: warehouseIds.join(','),
    };

    if (dateFrom) {
      params.dateFrom = dateFrom;
    }
    if (dateTo) {
      params.dateTo = dateTo;
    }

    const response = await this.get<WBCoefficient[]>('/api/v1/acceptance/coefficients', params);
    
    if (response.error) {
      throw new Error(response.errorText || 'Failed to get coefficients');
    }

    return response.data || [];
  }

  /**
   * Get list of warehouses
   */
  async getWarehouses(): Promise<WBWarehouse[]> {
    const response = await this.get<WBWarehouse[]>('/api/v1/warehouses');
    
    if (response.error) {
      throw new Error(response.errorText || 'Failed to get warehouses');
    }

    return response.data || [];
  }

  /**
   * Get acceptance options for specific goods
   * @param barcodes Array of product barcodes
   * @param quantities Array of quantities (same order as barcodes)
   */
  async getAcceptanceOptions(
    barcodes: string[],
    quantities: number[]
  ): Promise<WBAcceptanceOptions[]> {
    if (barcodes.length !== quantities.length) {
      throw new Error('Barcodes and quantities arrays must have the same length');
    }

    const data = barcodes.map((barcode, index) => ({
      barcode,
      quantity: quantities[index],
    }));

    const response = await this.post<WBAcceptanceOptions[]>('/api/v1/acceptance/options', data);
    
    if (response.error) {
      throw new Error(response.errorText || 'Failed to get acceptance options');
    }

    return response.data || [];
  }

  /**
   * Get supplies list
   * @param limit Maximum number of supplies to return (default: 1000)
   * @param offset Offset for pagination (default: 0)
   */
  async getSupplies(limit: number = 1000, offset: number = 0): Promise<WBSupply[]> {
    const params = {
      limit,
      offset,
    };

    const response = await this.post<WBSupply[]>('/api/v1/supplies', {}, params);
    
    if (response.error) {
      throw new Error(response.errorText || 'Failed to get supplies');
    }

    return response.data || [];
  }

  /**
   * Get supply details by ID
   * @param supplyId Supply ID
   */
  async getSupplyDetails(supplyId: string): Promise<WBSupply> {
    const response = await this.get<WBSupply>(`/api/v1/supplies/${supplyId}`);
    
    if (response.error) {
      throw new Error(response.errorText || 'Failed to get supply details');
    }

    return response.data;
  }

  /**
   * Get supply goods by supply ID
   * @param supplyId Supply ID
   */
  async getSupplyGoods(supplyId: string): Promise<WBGood[]> {
    const response = await this.get<WBGood[]>(`/api/v1/supplies/${supplyId}/goods`);
    
    if (response.error) {
      throw new Error(response.errorText || 'Failed to get supply goods');
    }

    return response.data || [];
  }

  /**
   * Search for available slots based on criteria
   * @param warehouseIds Array of warehouse IDs to search
   * @param boxTypeIds Array of box type IDs to search
   * @param dateFrom Start date for search
   * @param dateTo End date for search
   * @param coefficientThreshold Minimum coefficient (0 or 1)
   * @param allowUnload Whether to allow unload
   */
  async searchAvailableSlots(
    warehouseIds: number[],
    boxTypeIds: number[],
    dateFrom: string,
    dateTo: string,
    coefficientThreshold: number = 0,
    allowUnload: boolean = true
  ): Promise<WBCoefficient[]> {
    // Get coefficients for all warehouses
    const coefficients = await this.getCoefficients(warehouseIds, dateFrom, dateTo);
    
    // Filter by criteria
    return coefficients.filter(coeff => 
      warehouseIds.includes(coeff.warehouseId) &&
      coeff.coefficient >= coefficientThreshold &&
      coeff.allowUnload === allowUnload
    );
  }

  /**
   * Check if specific warehouse and box type combination is available
   * @param warehouseId Warehouse ID
   * @param boxTypeId Box type ID
   * @param date Date to check
   */
  async checkSlotAvailability(
    warehouseId: number,
    boxTypeId: number,
    date: string
  ): Promise<boolean> {
    try {
      const coefficients = await this.getCoefficients([warehouseId], date, date);
      const coeff = coefficients.find(c => c.warehouseId === warehouseId);
      
      return coeff ? coeff.coefficient >= 0 && coeff.allowUnload : false;
    } catch (error) {
      console.error('Error checking slot availability:', error);
      return false;
    }
  }
}
