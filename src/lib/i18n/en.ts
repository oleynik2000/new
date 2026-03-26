import { Translations } from "./types";

const en: Translations = {
  common: {
    brandName: "AnonBoard",
    about: "About",
    guidelines: "Guidelines",
    faq: "FAQ",
    newPost: "+ New Post",
    backToHome: "Back to Home",
    loading: "Loading...",
    loadingError: "Loading error",
    notFound: "Not Found",
    anonymous: "Anonymous",
    report: "Report",
    reported: "Reported",
    reportSubmitted: "Report submitted",
    send: "Send",
    previous: "Previous",
    next: "Next",
    page: "Page",
    of: "of",
    comments: "comments",
    pts: "pts",
    or: "or",
    characters: "characters",
  },

  footer: {
    description:
      "Anonymous reviews on anything. Share your honest opinion without revealing your identity.",
    platform: "Platform",
    aboutUs: "About Us",
    communityGuidelines: "Community Guidelines",
    faq: "FAQ",
    trustSafety: "Trust & Safety",
    trustDescription:
      "All content is moderated. We use automated filters and community reporting to keep discussions safe and respectful.",
    activelyModerated: "Platform actively moderated",
    allRightsReserved: "All rights reserved.",
    builtWith: "Built with transparency, privacy, and respect in mind.",
  },

  home: {
    heroTitle: "Anonymous Reviews on Anything.",
    heroDescription:
      "Share honest opinions about people, companies, and products without revealing your identity. Your voice matters — and here, it's protected.",
    startDiscussion: "Leave a Review",
    readGuidelines: "Read Guidelines",
    moderatedPlatform: "Moderated platform",
    fullyAnonymous: "100% anonymous",
    communityDriven: "Community-driven",
    searchPlaceholder: "Search reviews...",
    newest: "Newest",
    mostPopular: "Most Popular",
    mostDiscussed: "Most Discussed",
    allCategories: "All Categories",
    person: "Person",
    company: "Company",
    product: "Product",
    other: "Other",
    noPostsYet: "No reviews yet",
    noPostsDescription:
      "Be the first to leave an anonymous review on this platform.",
    createFirstPost: "Create First Review",
  },

  about: {
    title: "About AnonBoard",
    missionTitle: "Our Mission",
    missionText1:
      "AnonBoard is a platform for anonymous reviews on anything. We believe anonymity empowers people to share genuine opinions about companies, products, public figures, and more — without fear of judgment or retaliation.",
    missionText2:
      "Whether you want to leave a review, discuss a trending topic, or raise awareness about an issue, AnonBoard provides a safe and moderated space for your voice.",
    whyAnonymousTitle: "Why Anonymous?",
    whyAnonymousText:
      "Anonymity is not about hiding — it's about freedom of expression. Many people hesitate to share honest feedback because they worry about social consequences. AnonBoard removes that barrier.",
    honestReviews: "Honest reviews:",
    honestReviewsDesc:
      "Share your real experience with products and services",
    openDiscussions: "Open discussions:",
    openDiscussionsDesc: "Debate ideas without personal attacks",
    whistleblowing: "Whistleblowing:",
    whistleblowingDesc: "Report issues that matter to the community",
    privacyFirst: "Privacy first:",
    privacyFirstDesc: "We never collect or store personal identity data",
    howItWorksTitle: "How It Works",
    step1Title: "Write a Review",
    step1Desc:
      "Share your opinion about a person, company, product, or anything else. No account required.",
    step2Title: "Discuss & Vote",
    step2Desc:
      "Comment on reviews, reply to others, and vote to highlight the most relevant content.",
    step3Title: "Stay Safe",
    step3Desc:
      "Report inappropriate content. Our moderation system keeps the platform clean and respectful.",
    commitmentTitle: "Our Commitment",
    commitmentText:
      "We are committed to maintaining a platform that is safe, fair, and useful. All content is subject to our",
    activelyModerated247: "Platform actively moderated 24/7",
    browseDiscussions: "Browse Reviews",
  },

  add: {
    createNewPost: "Write an Anonymous Review",
    shareForCommunity:
      "Share your honest opinion for the community — completely anonymously.",
    beforeYouPost: "Before you post",
    rule1: "- Be respectful and constructive in your reviews",
    rule2: "- No illegal content, harassment, or personal attacks",
    rule3: "- Provide accurate information when possible",
    rule4: "- All reviews are moderated and must follow our community guidelines",
    titleLabel: "Title",
    titlePlaceholder: "Enter a clear, descriptive title",
    descriptionLabel: "Description",
    descriptionPlaceholder: "Provide context and details (optional)",
    categoryLabel: "Category",
    imageLabel: "Image (optional)",
    imageUrlPlaceholder: "Image URL (https://...)",
    clickToUpload: "Click to upload an image",
    uploading: "Uploading...",
    imageFormats: "JPEG, PNG, WebP, GIF up to 5MB",
    imageAdded: "Image added:",
    tagsLabel: "Tags (comma-separated)",
    tagsPlaceholder: "technology, business, review",
    tagsHelp: "Add relevant tags to help others find your review",
    publishing: "Publishing...",
    publishAnonymously: "Publish Anonymously",
    identityNeverStored:
      "Your identity is never stored or shared. All reviews are anonymous.",
    titleRequired: "Title is required",
    uploadFailed: "Upload failed",
    fileUploadError: "File upload error",
    creationFailed: "Creation failed",
    connectionError: "Connection error. Please try again.",
  },

  faq_page: {
    title: "Frequently Asked Questions",
    subtitle: "Find answers to common questions about how AnonBoard works.",
    stillHaveQuestions: "Still have questions?",
    checkGuidelines: "Check out our community guidelines or leave a review.",
    communityGuidelines: "Community Guidelines",
    createPost: "Write a Review",
    questions: [
      {
        question: "Is AnonBoard really anonymous?",
        answer:
          "Yes. We do not require registration, login, or any personal information to post or comment. We do not store usernames, email addresses, or IP addresses in connection with your posts. Your identity is never associated with your content.",
      },
      {
        question: "How does content moderation work?",
        answer:
          "We use automated content filters to detect profanity and toxic language before it is published. Additionally, any user can report content they find inappropriate. Posts and comments that receive multiple reports are automatically hidden and flagged for admin review. Our admin team reviews flagged content and can hide or permanently remove violations.",
      },
      {
        question: "Can I post reviews about real people or companies?",
        answer:
          "Yes, you can review public figures, companies, and organizations. However, all posts must be factual and respectful. Personal attacks, defamation, doxxing (sharing private personal information), and harassment are strictly prohibited. Stick to honest opinions and verifiable facts.",
      },
      {
        question: "What types of content are not allowed?",
        answer:
          "We prohibit harassment, hate speech, illegal content, spam, misinformation, explicit material, and doxxing. Please read our Community Guidelines for a complete list. Content that violates these rules will be removed.",
      },
      {
        question: "How do I report inappropriate content?",
        answer:
          'Every post and comment has a "Report" button. Click it to flag the content for review. Reports are processed by our moderation system — content with multiple reports is automatically hidden pending admin review.',
      },
      {
        question: "Is there a limit on how much I can post?",
        answer:
          "We implement rate limiting to prevent spam and abuse. Under normal usage, you should not encounter any limits. If you see a rate limit message, please wait a minute before trying again.",
      },
      {
        question: "Can I edit or delete my reviews?",
        answer:
          "Since the platform is fully anonymous, we do not offer edit or delete functionality for regular users. If you need content removed, you can report your own post and an admin will review it.",
      },
      {
        question: "How does the voting system work?",
        answer:
          "Each review can be upvoted or downvoted. The total score is displayed on the post. You can change your vote at any time — clicking the same vote button again will remove your vote. Voting helps the community surface the most relevant and useful content.",
      },
      {
        question: "Are there ads on AnonBoard?",
        answer:
          "Currently, AnonBoard is ad-free. In the future, we may introduce non-intrusive advertising to support platform operations. Any ads will be clearly marked and will never compromise user privacy or experience.",
      },
      {
        question: "How can I contact the team?",
        answer:
          "For general inquiries, suggestions, or concerns about content, please use the report feature. For urgent matters or business inquiries, we can be reached through the admin panel.",
      },
    ],
  },

  guidelines_page: {
    title: "Community Guidelines",
    subtitle:
      "These guidelines help us maintain a safe, respectful, and productive community. By using AnonBoard, you agree to follow these rules.",
    welcomeTitle: "What is welcome",
    welcomeItems: [
      "Honest and constructive reviews of products, companies, and services",
      "Respectful discussions and debates on public topics",
      "Sharing personal experiences and factual information",
      "Reporting content that violates these guidelines",
      "Asking questions, seeking advice, and helping others",
    ],
    notAllowedTitle: "What is not allowed",
    notAllowedItems: [
      {
        title: "Harassment and bullying:",
        description:
          "Personal attacks, threats, or targeted harassment of individuals",
      },
      {
        title: "Hate speech:",
        description:
          "Content promoting discrimination based on race, religion, gender, sexual orientation, or ethnicity",
      },
      {
        title: "Illegal content:",
        description:
          "Anything that promotes or facilitates illegal activities",
      },
      {
        title: "Spam and self-promotion:",
        description:
          "Excessive advertising, link spam, or repetitive content",
      },
      {
        title: "Misinformation:",
        description: "Deliberately false information intended to mislead",
      },
      {
        title: "Explicit content:",
        description: "Pornographic, extremely violent, or graphic material",
      },
      {
        title: "Doxxing:",
        description:
          "Posting private personal information of others without consent",
      },
    ],
    moderationTitle: "How We Moderate",
    moderationIntro:
      "We use a multi-layered approach to content moderation to keep the platform safe:",
    moderationItems: [
      {
        title: "Automated filters:",
        description:
          "Profanity detection and toxic content filtering applied to all posts and comments",
      },
      {
        title: "Community reporting:",
        description:
          "Users can report content that violates guidelines. Content with multiple reports is automatically hidden for review",
      },
      {
        title: "Rate limiting:",
        description: "Protections against spam and automated abuse",
      },
      {
        title: "Admin review:",
        description:
          "Reported content is reviewed by administrators who can hide or remove violations",
      },
    ],
    enforcementTitle: "Enforcement",
    enforcementText:
      "Content that violates these guidelines may be hidden or permanently removed without notice. Repeated violations may result in IP-based restrictions. We reserve the right to take action on any content that we determine is harmful to the community, even if not explicitly covered above.",
    questionsAboutGuidelines: "Have questions about our guidelines?",
    readFaq: "Read our FAQ",
  },

  admin: {
    dashboard: "Admin Dashboard",
    monitorContent: "Monitor and moderate platform content.",
    posts: "Posts",
    commentsLabel: "Comments",
    reports: "Reports",
    hiddenPosts: "Hidden Posts",
    hiddenComments: "Hidden Comments",
    recentReports: "Recent Reports",
    noReportsYet: "No reports yet",
    noReportsDescription:
      "The community is behaving well. No reports have been submitted.",
    post: "Post",
    comment: "Comment",
    reason: "Reason",
    hide: "Hide",
    show: "Show",
    delete: "Delete",
  },

  entity: {
    postNotFound: "Post not found",
    commentsTitle: "Comments",
    noCommentsYet: "No comments yet",
    noCommentsDescription: "Be the first to share your thoughts on this topic.",
    commentPlaceholder: "Share your thoughts anonymously...",
    commentRules: "Be respectful. No personal attacks or illegal content.",
    postComment: "Post Comment",
    sending: "Sending...",
    reply: "Reply",
    replyPlaceholder: "Write a respectful reply...",
    connectionError: "Connection error",
  },

  languages: {
    uk: "Ukrainian",
    en: "English",
    ru: "Russian",
    es: "Spanish",
  },
};

export default en;
