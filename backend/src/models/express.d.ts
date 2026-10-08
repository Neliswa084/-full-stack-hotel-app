import  {User} from './user.model'

// plan here is to have authentication middleware that identifies user
// and attaches their profile to the request object. 
//  This way, we can access the user information in our route handlers without having to query the database again.
declare global {
    namespace Express {
        export interface Request {
            user?: User;
        }
    }
}

