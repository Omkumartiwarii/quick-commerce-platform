import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CatalogService } from './catalog.service';

@ApiTags('Catalog & Products')
@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('categories')
  @ApiOperation({ summary: 'List all top-level grocery categories' })
  async getCategories() {
    return this.catalogService.listCategories();
  }

  @Get('products')
  @ApiOperation({ summary: 'List products filtered by category and search keyword' })
  async getProducts(@Query('category') category?: string, @Query('q') q?: string) {
    return this.catalogService.listProducts(category, q);
  }

  @Get('products/:id')
  @ApiOperation({ summary: 'Get full product detail with variants, MRP, GST and HSN code' })
  async getProduct(@Param('id') id: string) {
    return this.catalogService.getProductById(id);
  }
}
