import { Component, OnInit } from '@angular/core';
import recommendedCharities from './recommended-charities.json';
import { CharityPageService } from './charity-page.service';
import { Account } from 'app/core/auth/account.model';

type recoCharities = {
  id: number;
  charityName: string;
  description: string;
  logoURL: string;
  website: string;
  user?: Account;
}[];

type charityUserType = {
  id: number;
  charityName: string;
  description: string;
  logoURL: string;
  website: string;
  user: {
    createdBy: string;
    createdDate: string;
    lastModifiedBy: string;
    lastModifiedDate: string;
    id: number;
    login: string;
    firstName: string;
    lastName: string;
    email: string;
    activated: boolean;
    langKey: string;
    imageUrl: string | null;
    resetDate: string | null;
  };
};

@Component({
  selector: 'jhi-charity-page',
  templateUrl: './charity-page.component.html',
  styleUrls: ['./charity-page.component.css'],
})
export class CharityPageComponent implements OnInit {
  charities: recoCharities = [];

  constructor(private charityService: CharityPageService) {}

  ngOnInit(): void {
    this.charityService.getCharityUsers().subscribe(charityUsers => {
      // Filter out charity users with user.activated set to false
      const activeCharityUsers = charityUsers.filter((charityUser: charityUserType) => charityUser.user && charityUser.user.activated);

      // Concatenate the filtered charity users with the recommended charities
      this.charities = activeCharityUsers.concat(recommendedCharities);
    });
  }
}
