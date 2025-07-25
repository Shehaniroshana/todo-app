import { Observable } from 'rxjs';
import { User } from '../models/user.model';

export interface IAuthService {
  register(user: User): Observable<any>;
  login(credentials: User): Observable<any>;
  logout(): void;
  getToken(): string | null;
  isLoggedIn(): boolean;
}