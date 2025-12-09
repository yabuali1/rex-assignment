function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages = []
        const maxVisible = 5 // Max page buttons to show

        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
        let end = Math.min(totalPages, start + maxVisible - 1)

        // Adjust start if we're near the end
        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1)
        }

        for (let i = start; i <= end; i++) {
            pages.push(i)
        }

        return pages
    }

    const pageNumbers = getPageNumbers()

    return (
        <nav
            className="flex items-center justify-center gap-2 mt-8"
            aria-label="Pagination navigation"
        >
            {/* Previous Button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-sage-100 dark:bg-sage-800 hover:bg-sage-200 dark:hover:bg-sage-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Go to previous page"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            {/* First page + ellipsis */}
            {pageNumbers[0] > 1 && (
                <>
                    <button
                        onClick={() => onPageChange(1)}
                        className="w-10 h-10 rounded-lg bg-sage-100 dark:bg-sage-800 hover:bg-sage-200 dark:hover:bg-sage-700 transition-colors font-medium"
                        aria-label="Go to page 1"
                    >
                        1
                    </button>
                    {pageNumbers[0] > 2 && (
                        <span className="px-2 text-sage-400" aria-hidden="true">...</span>
                    )}
                </>
            )}

            {/* Page Numbers */}
            {pageNumbers.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${page === currentPage
                            ? 'bg-primary text-white'
                            : 'bg-sage-100 dark:bg-sage-800 hover:bg-sage-200 dark:hover:bg-sage-700'
                        }`}
                    aria-label={`Go to page ${page}`}
                    aria-current={page === currentPage ? 'page' : undefined}
                >
                    {page}
                </button>
            ))}

            {/* Last page + ellipsis */}
            {pageNumbers[pageNumbers.length - 1] < totalPages && (
                <>
                    {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                        <span className="px-2 text-sage-400" aria-hidden="true">...</span>
                    )}
                    <button
                        onClick={() => onPageChange(totalPages)}
                        className="w-10 h-10 rounded-lg bg-sage-100 dark:bg-sage-800 hover:bg-sage-200 dark:hover:bg-sage-700 transition-colors font-medium"
                        aria-label={`Go to page ${totalPages}`}
                    >
                        {totalPages}
                    </button>
                </>
            )}

            {/* Next Button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-sage-100 dark:bg-sage-800 hover:bg-sage-200 dark:hover:bg-sage-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Go to next page"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </nav>
    )
}

export default Pagination

