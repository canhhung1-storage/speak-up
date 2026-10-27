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
import { AdminLessonsService } from '../services/admin-lessons.service';
import { CreateLessonDto } from '../dto/create-lesson.dto';
import { UpdateLessonDto } from '../dto/update-lesson.dto';
import { ReorderLessonsDto } from '../dto/reorder-lessons.dto';
import {
  AdminLessonSummaryDto,
  AdminLessonDetailDto,
} from '../dto/admin-lesson-detail.dto';

@ApiTags('Admin - Lessons & Studio')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('admin')
export class AdminLessonsController {
  constructor(private readonly adminLessonsService: AdminLessonsService) {}

  @Get('courses/:courseId/lessons')
  @ApiOperation({ summary: 'Lấy danh sách tất cả bài học trong một khóa học' })
  @ApiParam({ name: 'courseId', description: 'UUID hoặc SEO Slug khóa học' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách bài học',
    type: [AdminLessonSummaryDto],
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy khóa học' })
  async getLessonsByCourse(
    @Param('courseId') courseId: string,
  ): Promise<AdminLessonSummaryDto[]> {
    return this.adminLessonsService.findByCourse(courseId);
  }

  @Patch('courses/:courseId/lessons/reorder')
  @ApiOperation({
    summary: 'Sắp xếp lại thứ tự bài học trong khóa học (Drag & Drop Reordering)',
  })
  @ApiParam({ name: 'courseId', description: 'UUID hoặc SEO Slug khóa học' })
  @ApiResponse({
    status: 200,
    description: 'Thứ tự bài học đã được cập nhật thành công',
    type: [AdminLessonSummaryDto],
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy khóa học' })
  async reorderLessons(
    @Param('courseId') courseId: string,
    @Body() dto: ReorderLessonsDto,
  ): Promise<AdminLessonSummaryDto[]> {
    return this.adminLessonsService.reorder(courseId, dto.lessonIds);
  }

  @Get('courses/:courseId/lessons/:id')
  @ApiOperation({
    summary:
      'Lấy chi tiết toàn diện bài học theo Course và Lesson (UUID hoặc SEO Slug)',
  })
  @ApiParam({ name: 'courseId', description: 'UUID hoặc SEO Slug khóa học' })
  @ApiParam({ name: 'id', description: 'UUID hoặc SEO Slug bài học' })
  @ApiResponse({
    status: 200,
    description: 'Chi tiết bài học phục vụ giao diện Lesson Studio',
    type: AdminLessonDetailDto,
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy bài học' })
  async getLessonByCourseAndId(
    @Param('courseId') courseId: string,
    @Param('id') id: string,
  ): Promise<AdminLessonDetailDto> {
    return this.adminLessonsService.findOne(id, courseId);
  }

  @Get('lessons/:id')
  @ApiOperation({
    summary: 'Lấy chi tiết toàn diện bài học (kèm bài đọc, từ vựng, audios)',
  })
  @ApiParam({ name: 'id', description: 'UUID hoặc SEO Slug bài học' })
  @ApiResponse({
    status: 200,
    description: 'Chi tiết bài học phục vụ giao diện Lesson Studio',
    type: AdminLessonDetailDto,
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy bài học' })
  async getLessonById(
    @Param('id') id: string,
  ): Promise<AdminLessonDetailDto> {
    return this.adminLessonsService.findOne(id);
  }

  @Post('courses/:courseId/lessons')
  @ApiOperation({ summary: 'Tạo bài học mới trong khóa học' })
  @ApiParam({ name: 'courseId', description: 'UUID hoặc SEO Slug khóa học' })
  @ApiResponse({
    status: 201,
    description: 'Tạo bài học thành công',
    type: AdminLessonDetailDto,
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy khóa học' })
  @ApiResponse({ status: 409, description: 'Trùng lặp slug trong cùng khóa học' })
  async createLesson(
    @Param('courseId') courseId: string,
    @Body() dto: CreateLessonDto,
  ): Promise<AdminLessonDetailDto> {
    return this.adminLessonsService.create(courseId, dto);
  }

  @Put('courses/:courseId/lessons/:id')
  @ApiOperation({
    summary:
      'Cập nhật toàn diện nội dung bài học theo Course và Lesson (UUID hoặc Slug)',
  })
  @ApiParam({ name: 'courseId', description: 'UUID hoặc SEO Slug khóa học' })
  @ApiParam({ name: 'id', description: 'UUID hoặc SEO Slug bài học' })
  @ApiResponse({
    status: 200,
    description: 'Lưu nội dung bài học thành công',
    type: AdminLessonDetailDto,
  })
  async updateLessonByCourseAndId(
    @Param('courseId') courseId: string,
    @Param('id') id: string,
    @Body() dto: UpdateLessonDto,
  ): Promise<AdminLessonDetailDto> {
    return this.adminLessonsService.update(id, dto, courseId);
  }

  @Put('lessons/:id')
  @ApiOperation({
    summary:
      'Cập nhật toàn diện nội dung bài học (Article, Vocabularies, Audios) trong 1 Transaction',
  })
  @ApiParam({ name: 'id', description: 'UUID hoặc SEO Slug bài học' })
  @ApiResponse({
    status: 200,
    description: 'Lưu nội dung bài học thành công',
    type: AdminLessonDetailDto,
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy bài học' })
  async updateLesson(
    @Param('id') id: string,
    @Body() dto: UpdateLessonDto,
  ): Promise<AdminLessonDetailDto> {
    return this.adminLessonsService.update(id, dto);
  }

  @Delete('courses/:courseId/lessons/:id')
  @ApiOperation({ summary: 'Xóa bài học theo Course và Lesson (UUID hoặc Slug)' })
  @ApiParam({ name: 'courseId', description: 'UUID hoặc SEO Slug khóa học' })
  @ApiParam({ name: 'id', description: 'UUID hoặc SEO Slug bài học' })
  @ApiResponse({ status: 200, description: 'Xóa bài học thành công' })
  async deleteLessonByCourseAndId(
    @Param('courseId') courseId: string,
    @Param('id') id: string,
  ): Promise<{ success: boolean; message: string }> {
    return this.adminLessonsService.delete(id, courseId);
  }

  @Delete('lessons/:id')
  @ApiOperation({ summary: 'Xóa bài học theo ID hoặc Slug' })
  @ApiParam({ name: 'id', description: 'UUID hoặc SEO Slug bài học' })
  @ApiResponse({ status: 200, description: 'Xóa bài học thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy bài học' })
  async deleteLesson(
    @Param('id') id: string,
  ): Promise<{ success: boolean; message: string }> {
    return this.adminLessonsService.delete(id);
  }
}
