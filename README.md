## Book Data Generator

This is a .NET 8 web application designed to serve as a testing tool by generating realistic, localized fake book data. The application provides a clean, modern user interface for controlling data generation parameters and viewing the results in a responsive, card-based layout with infinite scroll.

The primary purpose of this project is to demonstrate a full-stack development capability, including a stateless back-end API, a dynamic front-end UI, and the integration of third-party libraries to achieve complex, deterministic data generation.
![Screenshot_7-8-2025_124910_localhost](https://github.com/user-attachments/assets/8df5de34-a3fa-440e-aeff-8444250d0bf2)
![Screenshot_7-8-2025_124844_localhost](https://github.com/user-attachments/assets/20711bf1-7467-489a-ae8a-faa36a41411e)
![Screenshot_7-8-2025_124825_localhost](https://github.com/user-attachments/assets/5633ff77-bee1-432f-bdd3-bef9c3c1ef4a)


---

## Features

*   **Multi-Language Support:** Generate culturally appropriate data (author names, publishers, review text) for multiple locales, including English (USA), German (Germany), and Japanese (Japan).
*   **Deterministic Randomness:** Utilize a user-provided seed to generate reproducible data sets, which is critical for consistent testing scenarios.
*   **Dynamic Data Parameters:** Interactively control the average number of likes and reviews per book using sliders, with changes reflected instantly.
*   **Infinite Scroll:** A seamless user experience where new book cards are automatically fetched and rendered as the user scrolls down the page.
*   **Responsive Card Layout:** A modern, visually appealing grid of book cards that adapts to different screen sizes.
*   **Dynamic Cover Generation:** Book covers are generated on-the-fly, featuring the book's title and a unique, deterministic color scheme for visual variety.
*   **Interactive Details Modal:** Click on any book card to view a detailed popup with the full book information, including a scrollable list of reviews.

---

## Technology Stack

This project was built using a modern, industry-standard technology stack:

### Back-End

*   **.NET 8:** The latest long-term support version of the .NET platform.
*   **ASP.NET Core Web API:** For building the robust, stateless RESTful API endpoint.
*   **C# 12:** Leveraging the latest features of the C# programming language.
*   **Bogus:** A powerful and popular third-party library for generating realistic fake data.

### Front-End

*   **HTML5:** For structuring the web page content.
*   **CSS3:** For modern styling, including CSS Grid for the layout and custom properties for a maintainable design system.
*   **Vanilla JavaScript (ES6+):** For all client-side logic, including state management, API communication (`fetch`), dynamic DOM manipulation, and event handling. No front-end frameworks were used, as per the project's scope.

---

## Getting Started

To get this project running locally, you will need the [.NET 8 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/8.0) installed on your machine.

### 1. Clone the Repository

Clone this repository to your local machine using the following command:

```bash
git clone https://github.com/YOUR_USERNAME/BookDataGenerator-Task5.git
```
### 2. Navigate to the Project Directory

Open a terminal and navigate into the project's root directory:

```Generated bash
cd BookDataGenerator/BookDataGenerator
```
### 3. Run the Application

Use the .NET CLI to build and run the application. The project is configured to launch the Kestrel web server.

```Generated bash
dotnet run
```

The application will start and listen on a local port (e.g., https://localhost:7236). The terminal will display the exact URL. Open this URL in your web browser to use the application.

API Endpoint

The application exposes a single primary API endpoint for fetching book data.

GET /api/books

Fetches a paginated list of generated book objects.

```Query Parameters
Parameter	Type	Description	Default
locale	string	The language locale for data generation. Supported values: en, de, ja.	en
seed	integer	The seed value for the random number generator to ensure reproducible results.	42
page	integer	The page number for the data batch. Used for infinite scroll. Page 0 returns 20 items; subsequent pages return 10.	0
likes	double	The average number of likes per book. A value of 2.7 means 2 likes guaranteed, with a 70% chance of a third.	1.0
reviews	double	The average number of reviews per book.	1.0
Example Request ```
```Generated code
GET https://localhost:7236/api/books?locale=de&seed=123&page=1&likes=3.5
```
