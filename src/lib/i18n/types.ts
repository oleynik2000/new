export type Locale = "uk" | "en" | "ru" | "es";

export interface Translations {
  // Common / Layout
  common: {
    brandName: string;
    about: string;
    guidelines: string;
    faq: string;
    newPost: string;
    backToHome: string;
    loading: string;
    loadingError: string;
    notFound: string;
    anonymous: string;
    report: string;
    reported: string;
    reportSubmitted: string;
    send: string;
    previous: string;
    next: string;
    page: string;
    of: string;
    comments: string;
    pts: string;
    or: string;
    characters: string;
  };

  // Footer
  footer: {
    description: string;
    platform: string;
    aboutUs: string;
    communityGuidelines: string;
    faq: string;
    trustSafety: string;
    trustDescription: string;
    activelyModerated: string;
    allRightsReserved: string;
    builtWith: string;
  };

  // Home page
  home: {
    heroTitle: string;
    heroDescription: string;
    startDiscussion: string;
    readGuidelines: string;
    moderatedPlatform: string;
    fullyAnonymous: string;
    communityDriven: string;
    searchPlaceholder: string;
    newest: string;
    mostPopular: string;
    mostDiscussed: string;
    allCategories: string;
    person: string;
    company: string;
    product: string;
    other: string;
    noPostsYet: string;
    noPostsDescription: string;
    createFirstPost: string;
  };

  // About page
  about: {
    title: string;
    missionTitle: string;
    missionText1: string;
    missionText2: string;
    whyAnonymousTitle: string;
    whyAnonymousText: string;
    honestReviews: string;
    honestReviewsDesc: string;
    openDiscussions: string;
    openDiscussionsDesc: string;
    whistleblowing: string;
    whistleblowingDesc: string;
    privacyFirst: string;
    privacyFirstDesc: string;
    howItWorksTitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    commitmentTitle: string;
    commitmentText: string;
    activelyModerated247: string;
    browseDiscussions: string;
  };

  // Add page
  add: {
    createNewPost: string;
    shareForCommunity: string;
    beforeYouPost: string;
    rule1: string;
    rule2: string;
    rule3: string;
    rule4: string;
    titleLabel: string;
    titlePlaceholder: string;
    descriptionLabel: string;
    descriptionPlaceholder: string;
    categoryLabel: string;
    imageLabel: string;
    imageUrlPlaceholder: string;
    clickToUpload: string;
    uploading: string;
    imageFormats: string;
    imageAdded: string;
    tagsLabel: string;
    tagsPlaceholder: string;
    tagsHelp: string;
    publishing: string;
    publishAnonymously: string;
    identityNeverStored: string;
    titleRequired: string;
    uploadFailed: string;
    fileUploadError: string;
    creationFailed: string;
    connectionError: string;
  };

  // FAQ page
  faq_page: {
    title: string;
    subtitle: string;
    stillHaveQuestions: string;
    checkGuidelines: string;
    communityGuidelines: string;
    createPost: string;
    questions: {
      question: string;
      answer: string;
    }[];
  };

  // Guidelines page
  guidelines_page: {
    title: string;
    subtitle: string;
    welcomeTitle: string;
    welcomeItems: string[];
    notAllowedTitle: string;
    notAllowedItems: {
      title: string;
      description: string;
    }[];
    moderationTitle: string;
    moderationIntro: string;
    moderationItems: {
      title: string;
      description: string;
    }[];
    enforcementTitle: string;
    enforcementText: string;
    questionsAboutGuidelines: string;
    readFaq: string;
  };

  // Admin page
  admin: {
    dashboard: string;
    monitorContent: string;
    posts: string;
    commentsLabel: string;
    reports: string;
    hiddenPosts: string;
    hiddenComments: string;
    recentReports: string;
    noReportsYet: string;
    noReportsDescription: string;
    post: string;
    comment: string;
    reason: string;
    hide: string;
    show: string;
    delete: string;
  };

  // Entity page
  entity: {
    postNotFound: string;
    commentsTitle: string;
    noCommentsYet: string;
    noCommentsDescription: string;
    commentPlaceholder: string;
    commentRules: string;
    postComment: string;
    sending: string;
    reply: string;
    replyPlaceholder: string;
    connectionError: string;
  };

  // Language names
  languages: {
    uk: string;
    en: string;
    ru: string;
    es: string;
  };
}
