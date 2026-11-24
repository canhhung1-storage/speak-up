import { ApiProperty } from '@nestjs/swagger';

export class DailyActivityItemDto {
  @ApiProperty({ description: 'Date in YYYY-MM-DD format', example: '2026-11-20' })
  date: string;

  @ApiProperty({ description: 'Short day label', example: 'Fri' })
  dayLabel: string;

  @ApiProperty({ description: 'Minutes spent studying on this day', example: 25 })
  minutes: number;

  @ApiProperty({ description: 'Whether this entry represents today', example: true })
  isToday: boolean;
}
