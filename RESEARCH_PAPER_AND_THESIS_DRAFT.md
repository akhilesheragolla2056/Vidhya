# Vidhya: A Modular and Accessible E-Learning Platform with Multimedia Instruction, Formative Assessment, and Learning Progress Tracking

> **Academic draft notice:** This document is a research-paper draft and thesis foundation generated from the current implementation and repository documentation. Statements about implemented features are grounded in the source code and project documents. Statements about effectiveness, learner improvement, usability, or production scale must be validated with experiments, user studies, or operational measurements before submission.

## 1. Research Paper Draft

### Title

**Vidhya: Design and Implementation of a Modular and Accessible E-Learning Platform with Multimedia Instruction, Formative Assessment, and Learning Progress Tracking**

### Abstract

Online learning systems frequently combine video content, written material, assessment, and learner records, but these elements are often experienced as disconnected workflows. This project presents Vidhya, a web-based learning platform designed to integrate multimedia lessons, theory notes, multiple-choice assessment, authentication, course enrollment, progress tracking, mock examinations, interactive laboratories, AI-assisted learning, and accessibility-oriented interface features within a single system. The platform uses a React single-page client and a Node.js and Express server backed by MongoDB. Client-side state is managed with Redux Toolkit and TanStack Query, while Socket.IO supports real-time communication and selected services are exposed through REST APIs. Learning content can be delivered through embedded video, Markdown notes, and formative quizzes. Progress is represented through lesson completion, video watch percentage, note-reading status, quiz results, and course-level completion. This paper describes the platform requirements, architecture, implementation, security controls, interaction model, and proposed evaluation methodology. The current implementation demonstrates technical feasibility; however, learner effectiveness and usability remain empirical questions requiring controlled testing with representative participants.

**Keywords:** e-learning, learning management system, formative assessment, progress tracking, multimedia learning, accessibility, React, Node.js, MongoDB

### 1.1 Introduction

Digital learning environments must support more than content presentation. Learners need clear navigation, immediate feedback, persistent progress, secure accounts, and access to content in forms that match different learning preferences. In a fragmented system, a learner may watch a video in one location, read notes elsewhere, and complete an assessment without a unified record of learning activity. This fragmentation can make it difficult for learners to understand what remains to be completed and difficult for instructors or administrators to monitor progress.

Vidhya addresses this problem by presenting course content as a structured learning workflow. A course may contain video lessons, Markdown-based theory notes, and multiple-choice questions. The client provides course browsing, filtering, lesson navigation, progress indicators, and responsive layouts. The server provides authentication, course and enrollment APIs, progress operations, AI-related routes, classroom functions, laboratories, analytics, games, and real-time communication infrastructure.

The central research problem is:

> **How can a modular web learning platform integrate multimedia instruction, formative assessment, persistent progress tracking, and accessibility features into a coherent learner workflow while maintaining security, responsiveness, and extensibility?**

The project has four objectives:

1. Design a unified learning workflow for browsing, enrollment, study, assessment, and progress review.
2. Implement a maintainable client-server architecture that supports future expansion of learning services.
3. Provide immediate formative feedback through quizzes, mock tests, and completion indicators.
4. Establish an evaluation framework for usability, reliability, accessibility, and learning outcomes.

### 1.2 Research Questions

**RQ1.** Does integrating video, notes, quizzes, and progress indicators reduce friction in the learner workflow compared with separate learning tools?

**RQ2.** How usable and accessible is the platform for learners with different devices, learning preferences, and accessibility needs?

**RQ3.** Can a modular React and Node.js architecture support the addition of AI tutoring, laboratories, classrooms, games, analytics, and certification features without disrupting the core course workflow?

**RQ4.** What technical and instructional limitations arise from combining local progress persistence with authenticated server-side progress management?

### 1.3 Contribution of the Work

This project contributes:

- A reference architecture for a full-stack learning platform.
- A reusable lesson model combining video, notes, and MCQs.
- A progress model that represents video activity, note completion, quiz scores, lesson completion, and course status.
- An authenticated course workflow with enrollment and lesson completion endpoints.
- A practical evaluation plan that separates implemented capability from measured educational impact.

### 1.4 Related Work Review Framework

The final thesis should review research in the following areas rather than treating the platform documentation as a literature review:

1. **Learning management systems:** course organization, enrollment, learner records, and instructor workflows.
2. **Multimedia learning:** the instructional role of combining video, text, visual material, and learner-controlled pacing.
3. **Formative assessment:** low-stakes quizzes, immediate feedback, repeated attempts, and misconception correction.
4. **Learning analytics:** event collection, progress indicators, privacy, interpretation, and learner agency.
5. **Accessibility and inclusive design:** keyboard access, semantic labelling, contrast, responsive layouts, and user-specific accessibility needs.
6. **Adaptive and AI-assisted learning:** personalization, explainability, safety, and the limits of automated educational support.

The author should replace this framework with a formal literature review containing recent peer-reviewed sources, standards, and foundational studies. Citation placeholders are intentionally not fabricated here.

### 1.5 System Requirements

#### Functional requirements

- Users can register, authenticate, restore sessions, log out, and use supported OAuth providers.
- Authenticated learners can browse courses, search, filter, enroll, and open course details.
- Courses contain modules or lessons with video, notes, and assessment content.
- Learners can mark lessons complete and view course progress.
- Quizzes provide answer selection, scoring, explanations, review, and reattempts.
- Mock tests provide question navigation, timed submission, scoring, and answer review.
- The platform exposes learning-related modules for AI assistance, classrooms, laboratories, games, analytics, and progress.
- The interface supports responsive layouts and accessibility-related options such as keyboard navigation, ARIA labels, visible focus states, high contrast, and dyslexia-oriented presentation settings.

#### Non-functional requirements

- The client should remain responsive across desktop, tablet, and mobile viewports.
- The server should validate requests, handle errors consistently, apply rate limiting, and enforce authentication for protected resources.
- Secrets and external service credentials should be supplied through environment variables.
- The architecture should allow individual pages and services to evolve independently.
- User progress should persist across sessions according to the selected storage model.

## 2. System Design and Architecture

### 2.1 High-Level Architecture

Vidhya is organized as a client-server web application:

```text
Learner browser
      |
      | React SPA, React Router, Redux Toolkit, TanStack Query
      v
Node.js / Express API and Socket.IO server
      |
      +-- Authentication and OAuth
      +-- Courses, enrollment, and progress
      +-- AI, classrooms, laboratories, games, analytics
      |
      v
MongoDB persistence and external services
```

The client uses lazy-loaded routes and reusable components. The server uses Express routes, middleware, Mongoose models, JWT authentication, security middleware, compression, CORS controls, and rate limiting. Socket.IO is initialized for real-time communication. External integrations include YouTube video delivery, Google and Twitter OAuth, and optional AI services configured through environment variables.

### 2.2 Client Architecture

The client is implemented with React 18. React Router handles navigation. Redux Toolkit stores cross-cutting application state such as user, accessibility, classroom, and AI tutor data. TanStack Query manages server state, caching, and query invalidation for course and progress operations. Framer Motion supplies interface transitions, Tailwind CSS supplies utility-based styling, and React Markdown renders study notes.

Important learner-facing surfaces include:

- Landing and showcase pages.
- Dashboard and profile pages.
- Course browsing and course-detail pages.
- Course lessons with video, notes, and quizzes.
- Mock tests and result review.
- Science laboratory and gamified learning surfaces.
- AI tutor, code helper, essay helper, math helper, and study chat surfaces.

### 2.3 Server Architecture

The server entry point configures environment loading, Express, CORS, Helmet, compression, JSON parsing, rate limiting, health checks, Socket.IO, MongoDB connectivity, route registration, and centralized error handling. The route modules include authentication, courses, AI, classrooms, laboratories, analytics, progress, and games.

The data layer includes models for users, courses, certificates, daily missions, experiments, game sessions, mock tests, test attempts, user progress, and video progress. This model set indicates that the platform is designed as more than a static course catalogue: it also represents engagement, assessment, achievement, and practical learning activities.

### 2.4 Authentication and Security

Authentication supports password-based registration and login as well as Google and Twitter OAuth integrations. Passwords are hashed with bcrypt before persistence. JWTs are used for session authorization. Protected routes use authentication middleware. The server also configures Helmet, CORS origin checks, compression, request rate limiting, request-size limits, and centralized error handling.

The thesis evaluation should verify, rather than assume, the following security properties:

- Passwords and tokens are not exposed in logs or client-visible error messages.
- OAuth state and callback validation prevent login CSRF and redirect abuse.
- Authorization checks prevent users from reading or modifying another learner's progress.
- Production secrets are not committed to the repository.
- Rate limits and input validation behave correctly under malformed or repeated requests.

### 2.5 Learning and Progress Model

The learning workflow uses several related progress signals:

```text
video watch percentage
        + note reading status
        + quiz score and pass status
        -> lesson completion
        -> course completion percentage and status
```

The static learning experience stores a course progress object in localStorage. The broader application also supports authenticated server-side progress and enrollment operations. These two mechanisms should be described as separate modes in the final thesis unless testing confirms that they are fully synchronized. This is a significant design issue for evaluation because local persistence and server persistence have different reliability, privacy, and multi-device properties.

## 3. Implementation Methodology

### 3.1 Development Approach

The platform was developed incrementally by identifying learner-facing requirements, implementing reusable components, connecting routes and state, and documenting the resulting behavior. The implementation follows a modular structure in which pages coordinate workflows and components encapsulate video, notes, quizzes, navigation, and progress presentation.

### 3.2 Core Learning Workflow

1. The learner opens the course catalogue.
2. The learner searches or filters courses by category or difficulty.
3. The learner opens a course and enrolls when authentication is required.
4. The learner selects a module or lesson.
5. The learner watches the embedded video, reads the notes, and attempts the quiz.
6. The platform records the relevant progress event.
7. The learner receives immediate feedback and can review or reattempt assessment items.
8. The course view recalculates lesson and course completion status.

### 3.3 Assessment Components

The platform includes lesson-level MCQs and a separate mock-test workflow. Lesson quizzes emphasize formative feedback and explanations. Mock tests add a timer, question navigation, automatic submission at timeout, score calculation, and detailed review. These are suitable for evaluating feedback clarity, interaction cost, scoring correctness, and state persistence.

### 3.4 Accessibility and Responsive Design

The implementation documents keyboard navigation, ARIA labels, visible focus states, contrast modes, dyslexia-oriented settings, and mobile-responsive layouts. These features should be validated with automated accessibility checks and human participants. A claim of WCAG compliance should not be made until the relevant success criteria have been tested and documented.

## 4. Evaluation Plan

### 4.1 Evaluation Design

Use a mixed-method evaluation with three parts:

1. **Functional testing:** verify authentication, course loading, enrollment, lesson navigation, video embedding, quiz scoring, mock-test timing, progress persistence, and protected routes.
2. **Technical testing:** measure page-load performance, API latency, error rates, responsive behavior, accessibility violations, and behavior under concurrent requests.
3. **User evaluation:** recruit representative learners to complete course discovery, lesson study, quiz, and progress-review tasks; collect task success, completion time, errors, System Usability Scale responses, and semi-structured feedback.

### 4.2 Suggested Experimental Questions

- Do progress indicators help participants identify their next learning action?
- Does immediate quiz feedback improve post-test performance or confidence?
- Are learners able to recover from interrupted sessions without losing progress?
- Which content mode, video, notes, or quiz, is most frequently used and why?
- Do accessibility settings improve task completion for participants who need them?

### 4.3 Metrics

| Dimension     | Metric                                                                 | Collection method                    |
| ------------- | ---------------------------------------------------------------------- | ------------------------------------ |
| Usability     | Task success rate, time on task, error count, SUS score                | Observation and questionnaire        |
| Learning      | Pre-test/post-test difference, quiz retention, delayed test score      | Controlled study                     |
| Engagement    | Lesson completion, reattempt rate, return sessions, time per lesson    | Anonymized event logs                |
| Reliability   | API error rate, failed requests, recovery success                      | Server logs and integration tests    |
| Performance   | First load, route transition, API latency, bundle size                 | Browser and server profiling         |
| Accessibility | Automated violations, keyboard task success, participant feedback      | axe or equivalent plus human testing |
| Security      | Authorization failures, input-validation failures, dependency findings | Security tests and audits            |

### 4.4 Results Template

Do not submit invented results. Replace the following placeholders after testing:

> A total of **[N]** participants completed **[M]** tasks. The median task completion rate was **[X]%**, with a median task time of **[Y]** minutes. The mean System Usability Scale score was **[Z]**. Participants who used **[feature]** showed **[result]** on the post-test compared with **[comparison group or baseline]**. The most common failure was **[failure]**, which was addressed by **[change]**.

### 4.5 Threats to Validity

- Sample courses and questions may not represent all subjects or learner populations.
- Self-reported engagement can differ from actual learning.
- YouTube availability and network quality may affect video-based tasks.
- Static sample data can overstate the maturity of content authoring and content governance.
- A short study cannot establish long-term retention or course completion behavior.
- LocalStorage progress and server progress may produce different results across devices or accounts.
- Product documentation may describe intended behavior that still requires runtime verification.

## 5. Discussion

Vidhya demonstrates how a learning workflow can be composed from focused modules rather than implemented as a single monolithic page. The combination of video, notes, quizzes, progress indicators, and mock tests creates a coherent path from content discovery to feedback. The client-server separation also provides a foundation for adding learner accounts, analytics, classrooms, laboratories, games, and AI-assisted tools.

The main research value of the system is not the use of a particular JavaScript framework. It is the integration of instructional interaction and technical state management. A learner's action is meaningful only when the platform can provide feedback, preserve the resulting state, and show the next useful action. This makes progress representation, assessment feedback, accessibility, and persistence central design concerns rather than secondary interface details.

At the same time, the current system should not be described as empirically proven to improve learning until the evaluation plan is executed. The repository contains implementation summaries and feature claims, but it does not yet contain a controlled user study, benchmark dataset, statistical analysis, or validated learning-outcome comparison. The final thesis should present the current work as a design-and-implementation contribution unless those studies are completed.

## 6. Conclusion

This thesis presents Vidhya as a modular full-stack e-learning platform that integrates multimedia instruction, formative assessment, persistent learner progress, secure access, and extensible learning services. The architecture combines a React client with a Node.js and Express server, MongoDB models, REST APIs, Socket.IO, and external content and identity providers. The implementation provides a practical foundation for course delivery and future research into usability, accessibility, learning analytics, and AI-assisted education.

The next academic step is evidence collection: execute the functional and technical test plan, conduct a small but ethically approved user study, analyze the results, and revise the claims accordingly.

## 7. Thesis Chapter Draft

### Chapter 1: Introduction

- Background and motivation
- Problem statement
- Aim and objectives
- Research questions
- Scope and delimitations
- Contribution
- Thesis organization

### Chapter 2: Literature Review

- E-learning and learning management systems
- Multimedia learning principles
- Formative assessment and feedback
- Learning analytics and progress visualization
- Accessibility and inclusive education
- AI-supported learning
- Research gap addressed by Vidhya

### Chapter 3: Requirements and Methodology

- Stakeholder and learner analysis
- Functional and non-functional requirements
- Development methodology
- Ethical considerations and privacy
- Evaluation design and metrics

### Chapter 4: System Analysis and Design

- Use-case model
- Client-server architecture
- Component and module design
- Data model and persistence strategy
- Authentication and authorization design
- Progress state model
- Accessibility and responsive design decisions

### Chapter 5: Implementation

- React application structure
- Routing and route guards
- Redux Toolkit and TanStack Query usage
- Course, video, notes, and quiz components
- Mock-test implementation
- Express routes and middleware
- MongoDB models
- OAuth and JWT integration
- AI, laboratory, classroom, game, and analytics modules

### Chapter 6: Testing and Evaluation

- Test environment
- Functional test cases
- API and integration tests
- Performance results
- Accessibility audit
- User study protocol
- Quantitative results
- Qualitative findings

### Chapter 7: Discussion

- Interpretation of findings
- Comparison with related work
- Design trade-offs
- LocalStorage versus server persistence
- Security, privacy, and governance implications
- Limitations and threats to validity

### Chapter 8: Conclusion and Future Work

- Summary of contributions
- Answers to research questions
- Practical implications
- Future improvements
- Closing conclusion

## 8. Recommended Appendices

- Appendix A: Participant information sheet and consent form
- Appendix B: User-study tasks and questionnaire
- Appendix C: Functional test cases and test evidence
- Appendix D: Database schema and API endpoint catalogue
- Appendix E: Accessibility audit results
- Appendix F: Screenshots of the main workflows
- Appendix G: Anonymized evaluation data and analysis scripts

## 9. Evidence and Revision Checklist

- [ ] Replace all product claims with runtime test evidence where appropriate.
- [ ] Confirm which routes and features are operational in the current build.
- [ ] Reconcile localStorage progress with server-side progress behavior.
- [ ] Run client and server builds and record versions and environment details.
- [ ] Add API, integration, and accessibility test results.
- [ ] Conduct an ethics-approved user evaluation before making learning-effectiveness claims.
- [ ] Add peer-reviewed references in the selected citation style.
- [ ] Remove placeholder metrics and bracketed text before submission.
- [ ] Include only screenshots and data that can be reproduced from the submitted version.

## 10. Suggested Initial References

Use the latest available editions and verify the required citation style before submission:

- Mayer, R. E. _Multimedia Learning_. Cambridge University Press.
- Nielsen, J. _Usability Engineering_. Academic Press.
- Brooke, J. “SUS: A Quick and Dirty Usability Scale.” In _Usability Evaluation in Industry_.
- World Wide Web Consortium. _Web Content Accessibility Guidelines (WCAG) 2.2_.
- OWASP Foundation. _OWASP Application Security Verification Standard_.
- ISO/IEC 25010. _Systems and Software Engineering: Systems and Software Quality Requirements and Evaluation_.

These references are starting points, not a completed literature review. Add recent peer-reviewed studies directly related to e-learning, formative assessment, learning analytics, accessibility, and AI-assisted education.
