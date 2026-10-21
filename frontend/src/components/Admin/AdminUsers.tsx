import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../redux/store'
import type {AdminUser} from '../../types/user'

import {fetchUsers} from '../../redux/reducers/adminUsersSlice'
