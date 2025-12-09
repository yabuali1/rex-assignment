import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

// Custom render function that wraps components with required providers
function customRender(ui, options = {}) {
  const AllProviders = ({ children }) => {
    return (
      <BrowserRouter>
        {children}
      </BrowserRouter>
    )
  }

  return render(ui, { wrapper: AllProviders, ...options })
}

// Re-export everything from testing-library
export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'

// Override render with custom render
export { customRender as render }

