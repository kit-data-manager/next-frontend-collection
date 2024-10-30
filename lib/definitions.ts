// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.

import {Session} from "next-auth";

export type DataResource = {
  id: string;
  titles: Title[];
  creators: Creator[];
  publisher: string;
  publicationYear: string;
  language: string;
  resourceType: ResourceType;
  descriptions: Description[];
  relatedIdentifiers: RelatedIdentifier[];
  dates: Date[];
  acls: Acl[];
  rights: Right[];
  subjects: Subject[];
  embargoDate: string;
  state: string;
  lastUpdate: string;
  children: ContentInformation[];
};

export type RelatedIdentifier = {
  identifierType: string;
  value: string;
  relationType: string;
}

export type Subject = {
  value: string;
  valueUri: string;
}

export type ResourceType = {
  value: string;
  typeGeneral: string;
}

export type Date = {
  value: string;
  type: string;
}
export type Title = {
  id: string;
  value: string;
  titleType: string;
};

export type Creator = {
  id: string;
  familyName: string;
  givenName: string;
};

export type Description = {
  id: string;
  type: string;
  description: string;
};

export type Acl = {
  id: string;
  sid: string;
  permission: Permission;
};

export enum Permission {
  NONE,
  READ,
  WRITE,
  ADMINISTRATE
}

export type Right = {
  id: string;
  schemeId: string;
  schemeUri: string;
};

export type ContentInformation = {
  id: string;
  parentResource: DataResource;
  relativePath: string;
  contentUri: string;
  mediaType: string;
  hash: string;
  size: number;
  tags: string[];
}

export type Tag = {
  color?: string;
  text?: string;
  iconName?: string;
  url?: string;
}

export type Pagination = {
  size:number;
  page: number;
}

export type DataResourcesSearchParams = {
  page?: Pagination;
  id?:string;
  state?:string;
  publicationYear?:string;
  publisher?:string;
}

export type ActuatorInfo = {
  branch:string;
  hash:string;
  buildTime:string;
  version:string;
}

export type KeycloakInfo = {
  realm:string;
}

export type Activity = {
  id: number;
  type: "INITIAL" |"UPDATE" | "TERMINAL";
  managed_type: string;
  author: string;
  commit_date: string;

}

export type ExtendedSession = Session & {accessToken?: string, groups?: string[] | undefined};



export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'paid';
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: 'pending' | 'paid';
};
