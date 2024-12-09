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
    generateButton.addEventListener('click', () => {
        const url = document.getElementById('article-url').value;
        const year = document.getElementById('publication-year').value;
        const title = document.getElementById('article-title').value;
        const currentDate = new Date();
        let authorsString = '';
        let referenceString = '';

        if (websiteOnlyCheckbox.checked) {
            // Website-only format
            const websiteName = getWebsiteName(url);
            authorsString = websiteName;
            referenceString = `(${websiteName}, ${year})`;
        } else {
            // Regular author format
            const authorInputs = document.querySelectorAll('.author-name');
            const authors = Array.from(authorInputs)
                .map(input => input.value.trim())
                .filter(name => name !== '')
                .map(name => formatAuthorName(name));

            if (authors.length === 1) {
                authorsString = authors[0];
                referenceString = `(${authors[0].split(',')[0]}, ${year})`;
            } else if (authors.length >= 2) {
                authorsString = authors.slice(0, -1).join(', ') + ' and ' + authors[authors.length - 1];
                referenceString = `(${authors[0].split(',')[0]} <i>et al.</i> ${year})`;
            }
        }

        // Generate full citation
        const citation = `${authorsString} (${year}) <i>${title}</i> Available at: ${url} [Accessed on ${formatDate(currentDate)}]`;
        citationOutput.innerHTML = citation;

        // Set reference format
        if (authorsString) {
            referenceOutput.innerHTML = referenceString;
        }
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
});
