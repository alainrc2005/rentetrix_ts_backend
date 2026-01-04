import { Controller, Post } from '@nestjs/common'
import { CategoriesService } from './categories.service'

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  getCategories() {
    return this.categoriesService.getCategories()
  }
}
