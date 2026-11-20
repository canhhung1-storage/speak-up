import {
  Controller,
  Get,
  Put,
  Param,
  Query,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../database/entities/user.entity';
import { ProgressService } from './progress.service';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { LessonProgressResponseDto } from './dto/lesson-progress-response.dto';
import { CourseProgressResponseDto } from './dto/course-progress-response.dto';

@ApiTags('Progress')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get('courses/:courseSlugOrId')
  @ApiOperation({
    summary: 'Get course learning progress',
    description:
      'Returns overall completion percentage and completion status for every lesson in the course.',
  })
  @ApiParam({
    name: 'courseSlugOrId',
    description: 'Course slug or UUID',
    example: 'flow-english',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Course progress retrieved successfully',
    type: CourseProgressResponseDto,
  })
  async getCourseProgress(
    @CurrentUser() user: User,
    @Param('courseSlugOrId') courseSlugOrId: string,
  ): Promise<CourseProgressResponseDto> {
    return this.progressService.getCourseProgress(user.id, courseSlugOrId);
  }

  @Get('lessons/:lessonSlugOrId')
  @ApiOperation({
    summary: 'Get lesson learning progress',
    description:
      'Returns the playback position and completion status for a specific lesson.',
  })
  @ApiParam({
    name: 'lessonSlugOrId',
    description: 'Lesson slug or UUID',
    example: 'baseball-pig',
  })
  @ApiQuery({
    name: 'course',
    required: false,
    description: 'Course slug or UUID context',
    example: 'flow-english',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lesson progress retrieved successfully',
    type: LessonProgressResponseDto,
  })
  async getLessonProgress(
    @CurrentUser() user: User,
    @Param('lessonSlugOrId') lessonSlugOrId: string,
    @Query('course') courseSlugOrId?: string,
  ): Promise<LessonProgressResponseDto> {
    return this.progressService.getLessonProgress(
      user.id,
      lessonSlugOrId,
      courseSlugOrId,
    );
  }

  @Put('lessons/:lessonSlugOrId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update lesson learning progress',
    description:
      'Saves the playback position, active track, and/or completed status for a lesson.',
  })
  @ApiParam({
    name: 'lessonSlugOrId',
    description: 'Lesson slug or UUID',
    example: 'baseball-pig',
  })
  @ApiQuery({
    name: 'course',
    required: false,
    description: 'Course slug or UUID context',
    example: 'flow-english',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lesson progress updated successfully',
    type: LessonProgressResponseDto,
  })
  async updateLessonProgress(
    @CurrentUser() user: User,
    @Param('lessonSlugOrId') lessonSlugOrId: string,
    @Body() dto: UpdateProgressDto,
    @Query('course') courseSlugOrId?: string,
  ): Promise<LessonProgressResponseDto> {
    return this.progressService.updateLessonProgress(
      user.id,
      lessonSlugOrId,
      dto,
      courseSlugOrId,
    );
  }
}
