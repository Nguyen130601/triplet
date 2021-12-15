import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchUsers, selectAllUsers } from './usersSlice'

export const UsersList = () => {
  const dispatch = useDispatch()
  const users = useSelector(selectAllUsers)
  const userStatus = useSelector(state => state.users.status)
  useEffect(() => {
    if (userStatus === 'loading') {
      dispatch(fetchUsers())
    }
  }, [userStatus, dispatch])

  const renderedUsers = users.map(user => {
    console.log('USER = '+JSON.stringify(user))
    return (
      <li key={user.userID}>
        <Link to={`/users/${user.userID}`}>{user.username}</Link>
      </li>
    )
  })

  return (
    <section>
      <h2>Users</h2>
      <ul>{renderedUsers}</ul>
    </section>
  )
}