type Tconfig = {
  mask: string;
  countryCode: number | string;
  prefix?: string;
  placeholder?: boolean | string;
};

type inputState = {
  value: string;
  config: Tconfig;
  myTemplate: regExpConfig[];
  prefix: string;
  globalRegExp: RegExp;
  countryCodeTemplate: string;
};

type regExpConfig = {
  length: number;
  regExp: string;
};
