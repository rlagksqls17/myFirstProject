import { createAuthProvider } from 'react-token-auth'

export const [useAuth, authFetch, login, logout] =
    createAuthProvider({
        accessTokenKey: 'access_token',

        // api요청 통해 새로운 refresh 토큰을 받아옴
        onUpdateToken: (token) => fetch('/api/refresh', {
            method: 'POST',
            body: token.access_token
        })
            .then(r => r.json())
    })