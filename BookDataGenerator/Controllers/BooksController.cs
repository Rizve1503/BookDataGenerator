using BookDataGenerator.Models;
using BookDataGenerator.Services;
using Microsoft.AspNetCore.Mvc;

namespace BookDataGenerator.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly BookGenerationService _bookGenerationService;

        // We "inject" the service here via the constructor.
        // The .NET dependency injection system will provide an instance of the service for us.
        public BooksController(BookGenerationService bookGenerationService)
        {
            _bookGenerationService = bookGenerationService;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Book>> GetBooks(
            [FromQuery] string locale = "en",
            [FromQuery] int seed = 42,
            [FromQuery] int page = 0,
            [FromQuery] double likes = 1.0,
            [FromQuery] double reviews = 1.0)
        {
            // Basic input validation is always a good idea.
            if (page < 0)
            {
                return BadRequest("Page number cannot be negative.");
            }

            // Add validation for the new locale parameter
            var supportedLocales = new[] { "en", "de", "ja" };
            if (!supportedLocales.Contains(locale))
            {
                return BadRequest("Unsupported locale specified.");
            }

            try
            {
                var books = _bookGenerationService.GenerateBooks(locale, seed, page, likes, reviews);
                return Ok(books);
            }
            catch (Exception ex)
            {
                // In a real app, you'd log this exception.
                return StatusCode(500, "An internal server error occurred.");
            }
        }
    }
}