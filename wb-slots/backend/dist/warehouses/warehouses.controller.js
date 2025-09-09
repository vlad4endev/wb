"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarehousesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const warehouses_service_1 = require("./warehouses.service");
const create_warehouse_dto_1 = require("./dto/create-warehouse.dto");
const update_warehouse_dto_1 = require("./dto/update-warehouse.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let WarehousesController = class WarehousesController {
    constructor(warehousesService) {
        this.warehousesService = warehousesService;
    }
    async create(req, createWarehouseDto) {
        return this.warehousesService.create(req.user.sub, createWarehouseDto);
    }
    async findAll(req) {
        return this.warehousesService.findAll(req.user.sub);
    }
    async findOne(id, req) {
        return this.warehousesService.findOne(id, req.user.sub);
    }
    async update(id, req, updateWarehouseDto) {
        return this.warehousesService.update(id, req.user.sub, updateWarehouseDto);
    }
    async remove(id, req) {
        return this.warehousesService.remove(id, req.user.sub);
    }
    async toggleActive(id, req) {
        return this.warehousesService.toggleActive(id, req.user.sub);
    }
};
exports.WarehousesController = WarehousesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Добавление склада' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Склад добавлен' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_warehouse_dto_1.CreateWarehouseDto]),
    __metadata("design:returntype", Promise)
], WarehousesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Получение всех складов пользователя' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Список складов' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WarehousesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Получение склада по ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Данные склада' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Склад не найден' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WarehousesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Обновление склада' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Склад обновлен' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Склад не найден' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, update_warehouse_dto_1.UpdateWarehouseDto]),
    __metadata("design:returntype", Promise)
], WarehousesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Удаление склада' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Склад удален' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Склад не найден' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WarehousesController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/toggle'),
    (0, swagger_1.ApiOperation)({ summary: 'Переключение активности склада' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Статус склада изменен' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Склад не найден' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WarehousesController.prototype, "toggleActive", null);
exports.WarehousesController = WarehousesController = __decorate([
    (0, swagger_1.ApiTags)('Склады'),
    (0, common_1.Controller)('warehouses'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [warehouses_service_1.WarehousesService])
], WarehousesController);
//# sourceMappingURL=warehouses.controller.js.map