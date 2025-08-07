using Microsoft.AspNetCore.Mvc.ViewEngines;

namespace BookDataGenerator.Models
{
    public class Book
    {
        public long Index { get; set; }
        public string Isbn { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public List<string> Authors { get; set; } = [];
        public string Publisher { get; set; } = string.Empty;
        public int Likes { get; set; }
        public string CoverImageUrl { get; set; } = string.Empty;
        public List<Review> Reviews { get; set; } = [];
    }
}