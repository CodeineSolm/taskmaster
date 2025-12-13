namespace TaskMaster.API.Models
{
    public class Task
    {
        public int Id { get; set; }
        public string Title { get; set; }

        public string? Description { get; set; }

        public bool IsCompleted { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        public int? UserId { get; set; }

        public Task()
        {

        }

        public Task(DTOs.CreateTaskDto createDto)
        {
            Title = createDto.Title;
            Description = createDto.Description;
            CreatedAt = DateTime.UtcNow;
        }

        public void UpdateFromDto(DTOs.UpdateTaskDto updateDto)
        {
            Title = updateDto.Title;
            Description = updateDto.Description;
            IsCompleted = updateDto.isCompleted;
            UpdatedAt = DateTime.UtcNow;
        }

        public DTOs.TaskResponseDto ToResponseDto()
        {
            return new DTOs.TaskResponseDto
            {
                Id = Id,
                Title = Title,
                Description = Description,
                IsCompleted = IsCompleted,
                CreatedAt = CreatedAt,
                UpdatedAt = UpdatedAt
            };
        }
    }
}
