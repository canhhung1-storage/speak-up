import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../../database/entities/user.entity';
import { AdminCoursesService } from '../services/admin-courses.service';
import { CreateCourseDto } from '../dto/create-course.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';
import { AdminCourseResponseDto } from '../dto/admin-course-response.dto';

@ApiTags('Admin - Courses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('admin/courses')
export class AdminCoursesController {
  constructor(private readonly adminCoursesService: AdminCoursesService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy toàn bộ danh sách khóa học (kể cả bản nháp)' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách khóa học',
    type: [AdminCourseResponseDto],
  })
  async getAllCourses(): Promise<AdminCourseResponseDto[]> {
    return this.adminCoursesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết 1 khóa học theo ID hoặc Slug' })
  @ApiParam({ name: 'id', description: 'UUID hoặc SEO Slug khóa học' })
  @ApiResponse({
    status: 200,
    description: 'Chi tiết khóa học',
    type: AdminCourseResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy khóa học' })
  async getCourseById(
    @Param('id') id: string,
  ): Promise<AdminCourseResponseDto> {
    return this.adminCoursesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Tạo mới khóa học' })
  @ApiResponse({
    status: 201,
    description: 'Tạo khóa học thành công',
    type: AdminCourseResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 409, description: 'Slug đã tồn tại' })
  async createCourse(
    @Body() dto: CreateCourseDto,
  ): Promise<AdminCourseResponseDto> {
    return this.adminCoursesService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin khóa học theo ID hoặc Slug' })
  @ApiParam({ name: 'id', description: 'UUID hoặc SEO Slug khóa học' })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật khóa học thành công',
    type: AdminCourseResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy khóa học' })
  async updateCourse(
    @Param('id') id: string,
    @Body() dto: UpdateCourseDto,
  ): Promise<AdminCourseResponseDto> {
    return this.adminCoursesService.update(id, dto);
  }

  @Patch(':id/publish')
  @ApiOperation({ summary: 'Bật/tắt nhanh trạng thái xuất bản (Publish / Draft)' })
  @ApiParam({ name: 'id', description: 'UUID hoặc SEO Slug khóa học' })
  @ApiResponse({
    status: 200,
    description: 'Trạng thái xuất bản đã thay đổi',
    type: AdminCourseResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy khóa học' })
  async togglePublish(
    @Param('id') id: string,
  ): Promise<AdminCourseResponseDto> {
    return this.adminCoursesService.togglePublish(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa khóa học theo ID hoặc Slug' })
  @ApiParam({ name: 'id', description: 'UUID hoặc SEO Slug khóa học' })
  @ApiResponse({ status: 200, description: 'Xóa khóa học thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy khóa học' })
  async deleteCourse(
    @Param('id') id: string,
  ): Promise<{ success: boolean; message: string }> {
    return this.adminCoursesService.delete(id);
  }
}
