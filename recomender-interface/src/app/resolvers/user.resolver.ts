import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { APIService } from '../services/api.service';
import { User } from '../core/user';
import { DesignerState } from '../services/designer-state.service';

@Injectable()
export class UserResolver implements Resolve<any> {
  constructor(private apiService: APIService) {}

  resolve(): Promise<User> {
    return this.apiService.getUser();
  }
}
