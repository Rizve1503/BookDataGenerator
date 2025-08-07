using Bogus;
using BookDataGenerator.Models;

namespace BookDataGenerator.Services
{
    public class BookGenerationService
    {
        private readonly string[] _coverColorPalette =
        [
            "4a4e69", "9a8c98", "c9ada7", "f2e9e4", "22223b",
            "6b705c", "a5a58d", "b7b7a4", "ddbea9", "ffe8d6",
            "003049", "d62828", "f77f00", "fcbf49", "eae2b7"
        ];

        private const int RecordsPerPage = 20;
        private const int SubsequentRecordsPerPage = 10;

        public IEnumerable<Book> GenerateBooks(string locale, int seed, int page, double averageLikes, double averageReviews)
        {
            int combinedSeed = seed + page;
            var randomizer = new Randomizer(combinedSeed);

            int recordsToGenerate = (page == 0) ? RecordsPerPage : SubsequentRecordsPerPage;
            int startingIndex = (page == 0) ? 1 : RecordsPerPage + ((page - 1) * SubsequentRecordsPerPage) + 1;

            var books = new List<Book>();

            for (int i = 0; i < recordsToGenerate; i++)
            {
                var bookSpecificRandomizer = new Randomizer(randomizer.Int());
                var faker = new Faker(locale);

                var authors = GenerateItems(bookSpecificRandomizer, 1, 2, () => faker.Name.FullName());
                var title = faker.Commerce.ProductName();
                var publisher = faker.Company.CompanyName();

                var likesAndReviewsRandomizer = new Randomizer(randomizer.Int());
                int likesCount = CalculateProbabilisticCount(likesAndReviewsRandomizer, averageLikes);
                var reviews = GenerateItems(likesAndReviewsRandomizer, averageReviews, () => new Review
                {
                    ReviewerName = faker.Name.FullName(),
                    ReviewText = string.Join(" ", faker.Lorem.Sentences(likesAndReviewsRandomizer.Int(1, 4)))
                });

                var book = new Book
                {
                    Index = startingIndex + i,
                    Isbn = faker.Commerce.Ean13(),
                    Title = title,
                    Authors = authors.ToList(),
                    Publisher = publisher,
                    Likes = likesCount,
                    CoverImageUrl = GenerateCoverUrl(title, bookSpecificRandomizer),

                    Reviews = reviews.ToList()
                };

                books.Add(book);
            }

            return books;
        }

        private string GenerateCoverUrl(string title, Randomizer bookRandomizer)
        {
            var bgColor = bookRandomizer.ListItem(_coverColorPalette);
            var textColor = "ffffff";
            var coverTitle = Uri.EscapeDataString(string.Join(" ", title.Split(' ').Take(4)));

            return $"https://placehold.co/400x600/{bgColor}/{textColor}?text={coverTitle}";
        }

        private int CalculateProbabilisticCount(Randomizer randomizer, double average)
        {
            if (average < 0) return 0;
            int baseCount = (int)Math.Floor(average);
            double fractionalPart = average - baseCount;
            return baseCount + (randomizer.Double() < fractionalPart ? 1 : 0);
        }

        private IEnumerable<T> GenerateItems<T>(Randomizer randomizer, double average, Func<T> factory)
        {
            int count = CalculateProbabilisticCount(randomizer, average);
            return Enumerable.Range(0, count).Select(_ => factory());
        }

        private IEnumerable<T> GenerateItems<T>(Randomizer randomizer, int min, int max, Func<T> factory)
        {
            int count = randomizer.Number(min, max);
            return Enumerable.Range(0, count).Select(_ => factory());
        }
    }
}