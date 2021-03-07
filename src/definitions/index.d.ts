type Tconfig = {
  countryCode: number | string;
  mask: string;
  placeholder?: boolean | string;
};

type inputState = {
  value: string;
  myTemplate: regExpConfig[];
};

type regExpConfig = {
  length: number;
  regExp: string;
};
