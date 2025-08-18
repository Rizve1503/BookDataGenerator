## Book Data Generator

This is a .NET 8 web application designed to serve as a testing tool by generating realistic, localized fake book data. The application provides a clean, modern user interface for controlling data generation parameters and viewing the results in two distinct, user-selectable layouts: a data-dense **Table View** and a responsive **Card Grid**.

The primary purpose of this project is to demonstrate a full-stack development capability, including a stateless back-end API, a dynamic front-end UI, and the intelligent implementation of project requirements and design constraints.

## Live Demo
https://youtu.be/AX4LfnCRIoQ

## Link to Deployed Project:
http://mybookgenerator.somee.com

### Final Application Views
![Screenshot_7-8-2025_163950_localhost](https://github.com/user-attachments/assets/26c7e810-9dfa-4100-86b4-6389647ea1b5)

![Screenshot_7-8-2025_16409_localhost](https://github.com/user-attachments/assets/9659114e-fc99-4ebc-8f82-a1530aa0c8b2)
![Screenshot_7-8-2025_15457_localhost](https://github.com/user-attachments/assets/1ee25934-f225-4aa6-a134-c62696921077)
![Screenshot_7-8-2025_164052_localhost](https://github.com/user-attachments/assets/0aba5d23-e5ea-40ad-abfc-ff643d88d1f0)
![Screenshot_7-8-2025_164037_localhost](https://github.com/user-attachments/assets/cfb34a67-31c4-4e59-9404-c6431b810a3f)
![Screenshot_7-8-2025_164024_localhost](https://github.com/user-attachments/assets/9157c974-a5e1-4ffd-8a0a-4f81b3417777)


---

## Features

*   **Dual View System:** Defaults to a data-dense **Table View** as per project requirements, with an optional, visually-rich **Card View**, switchable via a UI toggle.
*   **Robust Infinite Scroll:** A professional "fill-the-screen, then scroll" implementation that prevents annoying loading loops and works seamlessly in both table and card views.
*   **Multi-Language Support:** Generate culturally appropriate data (author names, publishers, review text) for multiple locales, including English (USA), German (Germany), and Japanese (Japan).
*   **Deterministic Randomness:** Utilize a user-provided seed to generate reproducible data sets, which is critical for consistent testing scenarios.
*   **Dynamic Data Parameters:** Interactively control the average number of likes and reviews per book using sliders, with changes reflected instantly across all views.
*   **Dynamic Cover Generation:** Book covers are generated on-the-fly, featuring the book's title and a unique, deterministic color scheme for visual variety.
*   **Interactive Details Modal:** Click on any book row or card to view a detailed popup with the full book information, including a scrollable list of reviews.

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
*   **Vanilla JavaScript (ES6+):** For all client-side logic, including state management, API communication (`fetch`), dynamic DOM manipulation, and event handling.

---

## Getting Started

To get this project running locally, you will need the [.NET 8 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/8.0) installed on your machine.

### 1. Clone the Repository

Clone this repository to your local machine using the following command:

```bash
git clone https://github.com/Rizve1503/BookDataGenerator.git
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

## API Endpoint

The application exposes a single primary API endpoint for fetching book data.

**GET /api/books**

Fetches a paginated list of generated book objects.


**Query Parameters**
**Parameter	Type	Description	Default**
locale	string	The language locale for data generation. Supported values: en, de, ja.	en
seed	integer	The seed value for the random number generator to ensure reproducible results.	42
page	integer	The page number for the data batch. Used for infinite scroll. Page 0 returns 20 items; subsequent pages return 10.	0
likes	double	The average number of likes per book. A value of 2.7 means 2 likes guaranteed, with a 70% chance of a third.	1.0
reviews	double	The average number of reviews per book.	1.0



Example Request
```Generated code
GET https://localhost:7236/api/books?locale=de&seed=123&page=1&likes=3.5
```
