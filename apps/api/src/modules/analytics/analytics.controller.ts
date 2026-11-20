import { Controller, Get, UseGuards, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../database/entities/user.entity';
import { AnalyticsService } from './analytics.service';
import { DashboardSummaryDto } from './dto/dashboard-summary.dto';
import { LessonStudyTimeItemDto } from './dto/lesson-study-time-item.dto';

@ApiTags('Analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @ApiOperation({
    summary: 'Get learner study time and activity dashboard analytics',
    description:
      'Returns cumulative study minutes, today progress vs goal, daily streak, and 7-day activity chart data.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Dashboard analytics retrieved successfully',
    type: DashboardSummaryDto,
  })
  async getDashboardSummary(
    @CurrentUser() user: User,
  ): Promise<DashboardSummaryDto> {
    return this.analyticsService.getDashboardSummary(user.id);
  }

  @Get('lessons')
  @ApiOperation({
    summary: 'Get study time breakdown per lesson',
    description:
      'Returns a list of all lessons studied by the learner with total minutes spent and completion status.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lesson study times retrieved successfully',
    type: [LessonStudyTimeItemDto],
  })
  async getLessonStudyTimes(
    @CurrentUser() user: User,
  ): Promise<LessonStudyTimeItemDto[]> {
    return this.analyticsService.getLessonStudyTimes(user.id);
  }
}
