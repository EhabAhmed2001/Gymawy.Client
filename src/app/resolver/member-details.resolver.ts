import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { MembersService } from '../Services/members.service';
import { IMember } from '../Interfaces/IMember';

export const memberDetailsResolver: ResolveFn<IMember> = (route, state) => {
// export const memberDetailsResolver: ResolveFn<boolean> = (route, state) => {
   const _membersService = inject(MembersService);

  return _membersService.GetMemberByUsername(route.paramMap.get('username')!);

  // return true;
};
