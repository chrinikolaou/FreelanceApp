using backend.Data;
using backend.Dto.JobDto;
using backend.Dto.NotificationDto;
using backend.Enum;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/v1/notifications")]
    public class NotificationsController : ControllerBase
    {
        private readonly DataContext _context;

        public NotificationsController(DataContext context)
        {
            _context = context;
        }

        
        [HttpGet("me")]
        [Authorize]
        public ActionResult<IEnumerable<NotificationDto>> GetUserNotifications()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            if (userId == null)
            {
                return Unauthorized();
            }


            var notifications = _context.Notifications
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.CreatedAt)
                .Select(n => new NotificationDto
                {
                    Id = n.Id,
                    Message = n.Message,
                    IsRead = n.IsRead,
                    CreatedAt = n.CreatedAt
                })
                .ToList();

            return Ok(notifications);
        }

        // GET: api/v1/notifications/5
        [HttpGet("{id}")]
        [Authorize]
        public ActionResult<NotificationDto> GetNotification(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            if (userId == null)
            {
                return Unauthorized();
            }

            var notification = _context.Notifications.Find(id);

            if (notification == null)
                return NotFound("Cannot find the notification you are searching for");

            if (notification.UserId != userId)
                return BadRequest("You can only see your notifications");//Not yours

            var dto = new NotificationDto
            {
                Id = notification.Id,
                Message = notification.Message,
                IsRead = notification.IsRead,
                CreatedAt = notification.CreatedAt
            };

            return Ok(dto);
        }

        // POST: api/v1/notifications
        [HttpPost]
        [Authorize]
        public ActionResult<NotificationDto> CreateNotification(CreateNotificationDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            if (userId == null)
            {
                return Unauthorized();
            }

            var notification = new Notification
            {
                UserId = dto.UserId,
                Message = dto.Message,
                CreatedAt = DateTime.UtcNow,
                IsRead = false
            };

            _context.Notifications.Add(notification);
            _context.SaveChanges();

            var result = new NotificationDto
            {
                Id = notification.Id,
                Message = notification.Message,
                IsRead = notification.IsRead,
                CreatedAt = notification.CreatedAt
            };

            return CreatedAtAction(nameof(GetNotification), new { id = notification.Id }, result);
        }

        // PUT: api/v1/notifications/mark-as-read/5
        [HttpPut("mark-as-read/{id}")]
        [Authorize]
        public IActionResult MarkAsRead(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            if (userId == null)
            {
                return Unauthorized();
            }

            var notification = _context.Notifications.Find(id);

            if (notification == null)
                return NotFound();

            if (notification.UserId != userId)
                return Forbid("Notification is not yours");

            notification.IsRead = true;
            _context.SaveChanges();

            return NoContent();
        }

        // DELETE: api/v1/notifications/5
        [HttpDelete("{id}")]
        [Authorize]
        public IActionResult DeleteNotification(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            if (userId == null)
            {
                return Unauthorized();
            }

            var notification = _context.Notifications.Find(id);

            if (notification == null)
                return NotFound();

            if (notification.UserId != userId)
                return Forbid("Notification is not yours");

            _context.Notifications.Remove(notification);
            _context.SaveChanges();

            return NoContent();
        }
    }
}
