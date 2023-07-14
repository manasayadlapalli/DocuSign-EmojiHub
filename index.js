const emojiListElement = document.getElementById('emojiList');
const paginationElement = document.getElementById('pagination');
const filterElement = document.getElementById('filter');
let currentPage = 1;
const emojisPerPage = 10;
let currentCategory = '';

// Function to fetch emoji details from the API
async function fetchEmojis() {
  try {
    const response = await fetch('https://emojihub.yurace.pro/api/all');
    const emojis = await response.json();
    return emojis;
  } catch (error) {
    console.error('Error fetching emojis:', error);
    return [];
  }
}

// Function to display emojis on the current page
function displayEmojis(emojis, page) {
  const startIndex = (page - 1) * emojisPerPage;
  const endIndex = page * emojisPerPage;
  const displayedEmojis = emojis.slice(startIndex, endIndex);

  emojiListElement.innerHTML = '';

  displayedEmojis.forEach(emoji => {
    const { name, category, group, htmlCode } = emoji;

    if (currentCategory === '' || currentCategory === category) {
      const emojiCard = document.createElement('div');
      emojiCard.className = 'emojiCard';

      const nameElement = document.createElement('h3');
      nameElement.textContent = name;

      const categoryElement = document.createElement('p');
      categoryElement.textContent = 'Category: ' + category;

      const groupElement = document.createElement('p');
      groupElement.textContent = 'Group: ' + group;

      const htmlCodeElement = document.createElement('p');
      htmlCodeElement.innerHTML = htmlCode.join(' ');

      emojiCard.appendChild(nameElement);
      emojiCard.appendChild(categoryElement);
      emojiCard.appendChild(groupElement);
      emojiCard.appendChild(htmlCodeElement);
      emojiListElement.appendChild(emojiCard);
    }
  });
}

// Function to calculate the total number of pages
function getTotalPages(emojis) {
  return Math.ceil(emojis.length / emojisPerPage);
}

// Function to generate pagination links
function createPaginationLinks(totalPages) {
  paginationElement.innerHTML = '';

  for (let page = 1; page <= totalPages; page++) {
    const link = document.createElement('a');
    link.href = '#';
    link.textContent = page;

    if (page === currentPage) {
      link.classList.add('active');
    }

    link.addEventListener('click', () => {
      currentPage = page;
      displayEmojis(emojis, currentPage);
      createPaginationLinks(totalPages);
    });

    paginationElement.appendChild(link);
  }
}

// Function to handle category filter change
function handleFilterChange() {
  currentCategory = filterElement.value;
  currentPage = 1;

  fetchEmojis()
    .then(emojis => {
      const filteredEmojis = emojis.filter(emoji => emoji.category === currentCategory || currentCategory === '');
      const totalPages = getTotalPages(filteredEmojis);
      displayEmojis(filteredEmojis, currentPage);
      createPaginationLinks(totalPages);
    })
    .catch(error => console.error('Error:', error));
}

// Fetch emojis and display them when the page loads
fetchEmojis()
  .then(emojis => {
    const totalPages = getTotalPages(emojis);
    displayEmojis(emojis, currentPage);
    createPaginationLinks(totalPages);
  })
  .catch(error => console.error('Error:', error));

// Attach event listener to the filter element
filterElement.addEventListener('change', handleFilterChange);
