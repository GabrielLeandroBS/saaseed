/**
 * i18n types
 *
 * Types for internationalization dictionaries and translations.
 */

import type { DateRangePickerTranslations } from "@/models/interfaces/components/generic/calendar";
import type { SearchTranslations } from "@/models/interfaces/components/generic/search";
import type { ComboboxTranslations } from "@/models/interfaces/components/generic/combobox";

/** Dashboard page translations */
export interface DashboardDictionary {
  title: string;
  payment: {
    required: string;
    pastDue: string;
    trialExpired: string;
    amountToPay: string;
    later: string;
    payNow: string;
    loading: string;
  };
  trial: {
    loading: string;
    active: string;
    expired: string;
    expiredNoPlan: string;
    remaining: string;
    lessThanOneDay: string;
    day: string;
    days: string;
  };
}

export interface GenericDictionary {
  loading: string;
  calendar: DateRangePickerTranslations;
  search: SearchTranslations;
  combobox: ComboboxTranslations;
}

export interface AuthDictionary {
  acceptTerms: string;
  confirmPassword: string;
  createAccount: string;
  dontHaveAccount: string;
  email: string;
  forgotPassword: string;
  forgotPasswordMessage: string;
  haveAccount: string;
  name: string;
  password: string;
  resetPasswordMessage: string;
  signIn: string;
  submit: string;
  submitSignIn: string;
  submitSignUp: string;
  subtitleForgotPassword: string;
  subtitleResetPassword: string;
  subtitleSignIn: string;
  subtitleSignUp: string;
  surname: string;
  titleForgotPassword: string;
  titleResetPassword: string;
  titleSignIn: string;
  titleSignUp: string;
  welcomeMessage: string;
  or: string;
  signInWithGoogle: string;
  signUpWithGoogle: string;
  welcomeTitle: string;
}

export interface CommonDictionary {
  placeholder: {
    confirmPassword: string;
    email: string;
    name: string;
    password: string;
    surname: string;
  };
  generic: {
    loading: string;
  };
  errors: {
    failedRequest: string;
    forgotPasswordFailed: string;
    signInFailed: string;
    userAlreadyExists: string;
    resetPasswordFailed: string;
  };
  success: {
    forgotPasswordSuccess: string;
    signInSuccess: string;
    userCreated: string;
    resetPasswordSuccess: string;
  };
  notFound: {
    title: string;
    description: string;
    returnHome: string;
  };
}

export interface ErrorsDictionary {
  failedRequest: string;
  forgotPasswordFailed: string;
  signInFailed: string;
  userAlreadyExists: string;
  resetPasswordFailed: string;
}

export interface SuccessDictionary {
  forgotPasswordSuccess: string;
  signInSuccess: string;
  userCreated: string;
  resetPasswordSuccess: string;
}

export interface PlaceholderDictionary {
  confirmPassword: string;
  email: string;
  name: string;
  password: string;
  surname: string;
}

export interface SidebarDictionary {
  shortDescription: string;
  navMain: {
    search: string;
    title: string;
  };
  navSecondary: {
    support: string;
    feedback: string;
  };
}

export interface DictionaryType {
  authentication: AuthDictionary;
  common: CommonDictionary;
  dashboard: DashboardDictionary;
  errors: ErrorsDictionary;
  generic: GenericDictionary;
  placeholder: PlaceholderDictionary;
  sidebar: SidebarDictionary;
  success: SuccessDictionary;
}
