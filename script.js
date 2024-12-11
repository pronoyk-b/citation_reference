document.addEventListener('DOMContentLoaded', function() {
    const authorsContainer = document.getElementById('authors-container');
    const addAuthorButton = document.getElementById('add-author');
    const generateButton = document.getElementById('generate-citation');
    const copyButton = document.getElementById('copy-citation');
    const copyReferenceButton = document.getElementById('copy-reference');
    const citationOutput = document.getElementById('citation-output');
    const referenceOutput = document.getElementById('reference-output');
    const websiteOnlyCheckbox = document.getElementById('website-only');

    // Show/hide author inputs based on checkbox
    websiteOnlyCheckbox.addEventListener('change', function() {
        authorsContainer.classList.toggle('show', !this.checked);
        addAuthorButton.classList.toggle('show', !this.checked);
    });

    // Initialize author inputs visibility
    authorsContainer.classList.add('show');
    addAuthorButton.classList.add('show');

    // Function to format author name (Smith, John -> Smith, J.)
    function formatAuthorName(fullName) {
        const parts = fullName.trim().split(' ');
        if (parts.length < 2) return fullName;
        
        const lastName = parts[parts.length - 1];
        const firstName = parts[0];
        return `${lastName}, ${firstName.charAt(0)}.`;
    }

    // Function to format date (9th December, 2024)
    function formatDate(date) {
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        
        const nth = (day) => {
            if (day > 3 && day < 21) return 'th';
            switch (day % 10) {
                case 1: return "st";
                case 2: return "nd";
                case 3: return "rd";
                default: return "th";
            }
        };
        
        return `${day}${nth(day)} ${month}, ${year}`;
    }

    // Function to get website name
    function getWebsiteName(url) {
        try {
            const hostname = new URL(url).hostname;
            // Remove www. from the hostname
            let domain = hostname.replace('www.', '');
            
            // Split the domain into parts
            const parts = domain.split('.');
            
            if (parts.length >= 2) {
                // Handle special cases like .co.uk, .com.au
                if (parts.length > 2 && parts[parts.length - 2].length <= 3) {
                    // For domains like example.co.uk
                    const mainPart = parts[parts.length - 3];
                    const suffix = parts.slice(-2).join('.');
                    return mainPart.charAt(0).toUpperCase() + mainPart.slice(1).toLowerCase() + '.' + suffix;
                } else {
                    // For regular domains like example.com
                    const mainPart = parts[parts.length - 2];
                    const suffix = parts[parts.length - 1];
                    return mainPart.charAt(0).toUpperCase() + mainPart.slice(1).toLowerCase() + '.' + suffix;
                }
            }
            
            return domain; // Return as is if it's a simple domain
        } catch (e) {
            return url; // Return original url if parsing fails
        }
    }

    // Add author input field
    addAuthorButton.addEventListener('click', () => {
        const authorDiv = document.createElement('div');
        authorDiv.className = 'author-input';
        authorDiv.innerHTML = `
            <input type="text" class="author-name" placeholder="Enter author name">
            <button type="button" class="remove-author">Remove</button>
        `;
        authorsContainer.appendChild(authorDiv);

        // Add remove functionality
        const removeButton = authorDiv.querySelector('.remove-author');
        removeButton.addEventListener('click', () => {
            authorDiv.remove();
        });
    });

    // Generate citation
    generateButton.addEventListener('click', function() {
        const citationStyle = document.querySelector('input[name="citation-style"]:checked').value;
        const authors = Array.from(document.querySelectorAll('.author-name')).map(input => input.value).filter(name => name);
        const publicationYear = document.getElementById('publication-year').value;
        const articleTitle = document.getElementById('article-title').value;
        const articleUrl = document.getElementById('article-url').value;

        let citationOutputText = '';
        let referenceOutputText = '';

        if (websiteOnlyCheckbox.checked) {
            const domainName = articleUrl.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
            const capitalizedDomain = domainName.charAt(0).toUpperCase() + domainName.slice(1);
            citationOutputText = `${capitalizedDomain} (${publicationYear}) <i>${articleTitle}</i> Retrieved from: ${articleUrl} [Accessed on ${formatDate(new Date())}]`;
            referenceOutputText = `(${capitalizedDomain}, ${publicationYear})`;
        } else if (citationStyle === 'apa') {
            // APA citation format
            const formattedAuthors = authors.map(formatAuthorName).join(', ');
            citationOutputText = `${formattedAuthors} (${publicationYear}). <i>${articleTitle}</i>. Retrieved from: ${articleUrl} [Accessed on ${formatDate(new Date())}]`;
        } else if (citationStyle === 'harvard') {
            // Harvard citation format
            const formattedAuthors = authors.map(formatAuthorName).join(', ');
            citationOutputText = `${formattedAuthors} (${publicationYear}). ${articleTitle}. Available at: ${articleUrl} (Accessed: ${formatDate(new Date())})`;
        }

        const lastName = (fullName) => {
            const parts = fullName.split(',');
            return parts.length > 1 ? parts[0].trim() : fullName.trim().split(' ').pop();
        };

        if (authors.length === 1) {
            referenceOutputText = `(${lastName(authors[0])}, ${publicationYear})`;
        } else if (authors.length === 2) {
            const sortedAuthors = authors.map(lastName).sort();
            referenceOutputText = `(${sortedAuthors.join(' and ')}, ${publicationYear})`;
        } else if (authors.length > 2) {
            referenceOutputText = `(${lastName(authors[0])} <i>et al.</i>, ${publicationYear})`;
        }

        citationOutput.innerHTML = citationOutputText;
        referenceOutput.innerHTML = referenceOutputText;
    });

    // Copy citation
    copyButton.addEventListener('click', () => {
        const tempElement = document.createElement('div');
        tempElement.innerHTML = citationOutput.innerHTML;
        const plainText = tempElement.innerText;
        
        navigator.clipboard.writeText(plainText).then(() => {
            const originalText = copyButton.textContent;
            copyButton.textContent = 'Copied!';
            setTimeout(() => {
                copyButton.textContent = originalText;
            }, 2000);
        });
    });

    // Copy reference
    copyReferenceButton.addEventListener('click', () => {
        const tempElement = document.createElement('div');
        tempElement.innerHTML = referenceOutput.innerHTML;
        const plainText = tempElement.innerText;
        
        navigator.clipboard.writeText(plainText).then(() => {
            const originalText = copyReferenceButton.textContent;
            copyReferenceButton.textContent = 'Copied!';
            setTimeout(() => {
                copyReferenceButton.textContent = originalText;
            }, 2000);
        });
    });

    // Remove DOI input field functionality
    const citationStyleRadios = document.querySelectorAll('input[name="citation-style"]');

    citationStyleRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            // No DOI input field needed for APA style
            const doiField = document.getElementById('doi-link');
            if (doiField) {
                doiField.parentElement.remove();
            }
        });
    });
});
