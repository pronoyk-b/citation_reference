# Citation Format Generator

A web-based tool that generates citations in two formats:

## Features

1. Full Citation Format
   - Supports multiple authors
   - Automatically formats author names (Surname, Initial.)
   - Handles website-only citations
   - Includes publication year, title, URL, and access date

2. Reference Format
   - Single author: (Smith, 2023)
   - Multiple authors: (Smith et al. 2023)
   - Website-only: (Example.com, 2023)

## How to Use

1. Choose between author-based or website-only citation
2. For author-based citations:
   - Enter author name(s)
   - Use "+ Add Another Author" button for multiple authors
3. For website-only citations:
   - Check "No author (Website only)" option
   - The website domain will be used as the author
4. Fill in other details:
   - Publication year
   - Article title
   - URL
5. Click "Generate Citation" to create both citation formats
6. Use "Copy Citation" or "Copy Reference" buttons to copy the desired format

## Citation Style

This generator currently supports Harvard Referencing Style, which is widely used in academic writing, particularly in social sciences and business studies. The Harvard style includes:

### In-text Citations
- Single author: (Smith, 2023)
- Two authors: (Smith & Jones, 2023)
- Three or more authors: (Smith et al., 2023)
- No date available: (Smith, n.d.)
- Multiple citations: (Smith, 2023; Jones, 2022)

### Reference List Format
- Books: Author, A.A. (Year) Title of book. Edition (if not first). Place of publication: Publisher.
- Journal articles: Author, A.A. (Year) 'Title of article', Journal Name, Volume(Issue), pp. xx-xx.
- Websites: Author/Organization (Year) Title of webpage. Available at: URL (Accessed: date).
- Online articles: Author, A.A. (Year) 'Title of article', Website Name, date if available. Available at: URL (Accessed: date).

## Technologies Used

- HTML
- CSS
- JavaScript (Vanilla)

## Future Enhancements
- Support for additional citation styles (APA, MLA, Chicago)
- Export citations in multiple formats (BibTeX, RIS)
- Browser extension integration
- Batch citation processing

V1.0
