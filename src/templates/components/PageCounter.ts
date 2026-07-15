let currentPage = 1;
let totalPages = 0;

export function resetPageCounter() {
    currentPage = 1;
}

export function getNextPage() {
    return currentPage++;
}

export function setTotalPages(total: number) {
    totalPages = total;
}

export function getTotalPages() {
    return totalPages;
}