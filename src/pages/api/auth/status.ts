import type { APIRoute } from 'astro';
import type { UserData } from '../../../components/Header.astro'; // Adjust path as needed

// Mock authenticated user data - toggle this for testing
const MOCK_IS_AUTHENTICATED = true;

const mockAuthenticatedUser: UserData = {
  firstName: "MockFirstName",
  lastName: "MockLastName",
  email: "mock.user@example.com",
  profileImageUrl: undefined // or a placeholder URL
};

export const GET: APIRoute = ({ request }) => {
  if (MOCK_IS_AUTHENTICATED) {
    return new Response(
      JSON.stringify({
        isAuthenticated: true,
        user: mockAuthenticatedUser
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } else {
    return new Response(
      JSON.stringify({
        isAuthenticated: false,
        user: null
      }),
      {
        status: 200, // Still 200 OK, but indicates not authenticated
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
};
