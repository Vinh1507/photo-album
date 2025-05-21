import { useRoutes } from 'react-router-dom'
import { ROUTES } from 'src/routes'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from './store/reducers/AuthSlice'
import MainLayout from 'src/layouts/MainLayout'
import AdminLayout from 'src/layouts/AdminLayout'
import Login from './pages/Login'
import NotFoundComponent from './pages/NotFound'
import UserManagementForAdmin from './pages/users/UserManagementForAdmin'
import UserManagementForStaff from './pages/users/UserManagementForStaff'
import OrganizationList from 'src/pages/admin/Organization/OrganizationList'
import CreateRequest from 'src/pages/Request/CreateRequest'
import RequestHistory from 'src/pages/Request/RequestHistory'
import UserConstant from './constants/UserConstant'
import StaffLayout from 'src/layouts/StaffLayout'

export default function useRouteElements() {
    const user = useSelector(selectCurrentUser)

    // Routes chung
    const authRoutes = [
        { path: ROUTES.LOGIN, element: <Login /> },
        { path: '/', element: <Login /> },
    ]

    const commonRoutes = [
        { path: '*', element: <NotFoundComponent /> },
    ]

    // Routes theo vai trò
    const roleRoutes = {
        [UserConstant.ROLE_ADMIN]: [
            {
                element: <AdminLayout />,
                children: [
                    { path: ROUTES.HOME, element: <UserManagementForAdmin /> },
                    { path: ROUTES.ADMIN_HOME, element: <UserManagementForAdmin /> },
                    { path: ROUTES.ADMIN_USERS, element: <UserManagementForAdmin /> },
                    { path: ROUTES.ADMIN_ORGS, element: <OrganizationList /> },
                    { path: ROUTES.ADMIN_REQUESTS, element: <RequestHistory /> },
                ],
            },
        ],
        [UserConstant.ROLE_STAFF]: [
            {
                element: <StaffLayout />,
                children: [
                    { path: ROUTES.HOME, element: <UserManagementForStaff /> },
                    { path: ROUTES.STAFF_USERS, element: <UserManagementForStaff /> },
                    { path: ROUTES.STAFF_REQUESTS, element: <RequestHistory /> },
                ],
            },
        ],
        [UserConstant.ROLE_MEMBER]: [
            {
                element: <MainLayout />,
                children: [
                    { path: ROUTES.HOME, element: <CreateRequest /> },
                    { path: ROUTES.HISTORY, element: <RequestHistory /> },
                ],
            },
        ],
    }

    const routes = [...(roleRoutes[user?.role] || authRoutes), ...commonRoutes]
    return useRoutes(routes)
}