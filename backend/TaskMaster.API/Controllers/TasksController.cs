using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskMaster.API.Models;
using TaskMaster.API.DTOs;

namespace TaskMaster.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TasksController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TasksController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskResponseDto>>> GetTasks()
        {
            var tasks = await _context.Tasks.ToListAsync();
            return tasks.Select(t => t.ToResponseDto()).ToList();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TaskResponseDto>> GetTask(int id)
        {
            var task = await _context.Tasks.FindAsync(id);

            if (task == null)
                return NotFound(new { message = $"Task with id {id} not found"});

            return task.ToResponseDto();
        }

        [HttpPost]
        public async Task<ActionResult<TaskResponseDto>> PostTask(CreateTaskDto createTaskDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var task = new Models.Task(createTaskDto);
            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTask), new { id = task.Id }, task.ToResponseDto());
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutTask(int id, UpdateTaskDto updateTaskDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var task = await _context.Tasks.FindAsync(id);

            if (task == null)
                return NotFound(new { message = $"Task with id {id} not found" });

            task.UpdateFromDto(updateTaskDto);
            _context.Entry(task).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TaskExists(id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        [HttpPatch("{id}/toggle")]
        public async Task<ActionResult<TaskResponseDto>> ToggleTask(int id)
        {
            var task = await _context.Tasks.FindAsync(id);

            if (task == null)
                return NotFound(new { message = $"Task with id {id} not found" });

            task.IsCompleted = !task.IsCompleted;
            task.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return task.ToResponseDto();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var task = await _context.Tasks.FindAsync(id);

            if (task == null)
                return NotFound(new {message = $"Task with id {id} not found" });

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TaskExists(int id)
        {
            return _context.Tasks.Any(e => e.Id == id);
        }
    }
}
