# Test Case Kumparan  

# Author: Riski Siahaan  

# Session: Manual  

| No  | Scenario | Test  Step | Expected Result | Status | Priority  | Test Type |
| :---- | :---- | :---- | :---- | :---: | :---- | :---- |
| TC\_KPN\_001 | Home Page- Kumparan home page load successfully | Navigate to [https\://kumparan.com/](https://kumparan.com/) Wait for loading to clear | Homepage visible Menu & Submenu visible Headline news carousel and trending section visible  | PASSED | P1 | Positive  |
| TC\_KPN\_002 | Home Page \-News cared exposed with required field | On Homepage  Inspect the first ‘news-carousel’  | Cards contain ‘image’, ‘title’ with non empty text | PASSED | P1 | Positive  |
| TC\_KPN\_003 | Home Page  \-  News Category compartments render | Scroll to ‘polling news;’video story’, ‘feed’ section   | Each compartment list items No empty container | PASSED | P2 | Positive  |
| TC\_KPN\_004 | Home Page \- Publish date format valid  | Read each news cared footer date values	 | Has a value Show relative time (hours) and date DD MM YYY | PASSED | P2 | Positive  |
| TC\_KPN\_005 | Home Page- Load more pagination | Scroll down the home page Trigger repeatedly  | New distinct card append No duplicated card Terminate with end of list state No infinite spinner | PASSED | P2 | Positive  |
| TC\_KPN\_006 | Navigation \- Header element visible | Load Homepage  | Header section, logo, search field, Home button, theme button, login button, buat tulisan button is visible and enabled | PASSED | P1 | Positive  |
| TC\_KPN\_007 | Navigation \- Kumparan logo navigates home  | from an article click logo | Redirect to home page | PASSED | P1 | Positive  |
| TC\_KPN\_008 | Navigation- Browser back button | Go to article  click one of the sub-menu(topic) Click browser back button twice | Navigates back to the initial page content matches URL | PASSED | P1 | State |
| TC\_KPN\_009 | Navigation- Unknown Route  | Navigate to /this-route-is-not-exist	 | Not found state is displayed No blank page | PASSED | P2 | Negative |
| TC\_KPN\_010 | Search- Search entry point visible  | Inspect search input field | Input visible with placeholder,focusable, and typeable | PASSED | P1 | Positive  |
| TC\_KPN\_011 | Search- Valid search returns results | Search ‘timnas’ Submit	 | Navigates to /search/timnas Result list renders with title, source and date | PASSED | P1 | Positive  |
| TC\_KPN\_012 | Search- Search page defaults  | Open /search with no query | Directed to search page Show popular list/ tag entries | PASSED | P2 | Positive  |
| TC\_KPN\_013 | Search- no result query | Search ‘asfjltoiwt’ or any unmatched query | Explicit empty state displayed No error, no blank page | PASSED | P2 | Negative |
| TC\_KPN\_014 | Search \- Empty Query submit | Click search field Submit with empty value | Directed to search page Show popular tag | PASSED | P2 | Data Validation |
| TC\_KPN\_015 | Search \- Max length query | Search a 256-char string | Query handled no layout break no broken navigation | PASSED | P3 | Boundary |
| TC\_KPN\_016 | Search \- Special character query | Search with ‘emoji’ or ‘unicode’ query | Renders and encodes correctly  No mojibake | PASSED | P3 | Boundary |
| TC\_KPN\_017 | Search \- network offline search | Go offline Submit a search | Error or empty state displayed No  infinite loading spinner | PASSED | P2 | Negative |
| TC\_KPN\_018 | Article \- Article renders fully  | Open one of the new article  | Title, Author, Publish Date, Reading time displayed Has \=\>1 paragraph | PASSED | P1 | Positive  |
| TC\_KPN\_019 | Article \- Body paragraph complete | Read all the story paragraph  | Story ordered sequentially non-empty No truncated block | PASSED | P1 | Positive  |
| TC\_KPN\_020 | Article \- Author and source attribution | Inspect ‘story-author’ 		 | Author name matched and displayed | PASSED | P1 | Data Validation |
| TC\_KPN\_021 | Article \- offline article load | Go offline Reload article | Friendly error | PASSED | P1  | Negative |
| TC\_KPN\_022 | Article \- topic tags present | sroll down to the end of article Click topics tag | Navigates to the related topics feed All article should have topic tags | PASSED | P1 | Positive  |
| TC\_KPN\_023 | Channel \- Channel feed renders | from Header menu click one of the channel	  | Load page with news card that related to the channel Each card clickable | PASSED | P1 | Positive  |
| TC\_KPN\_024 | Channel \- Card opens article | Click one of the channel click news article  | article page loads title matches card title | PASSED | P2 | Positive  |
| TC\_KPN\_025 | Channel \- pagination/ load more | scroll down channel news article | Distinct items append No duplicates | PASSED | P2 | Boundary |
| TC\_KPN\_026 | Channel \- topics route works | Click /topic  | Same behaviour as channel, headline items render | PASSED | P2 | Positive  |
| TC\_KPN\_027 | Topic / channel \- unknown topic/ channel | go to channel/somethingnotonchannel | Empty state or not found displayed No blank page | PASSED | P1 | Negative |
| TC\_KPN\_028 | Authentication \- Login form renders | Open /login page | Username and passwords field enabled Submit button enabled Login with third party enable (google, facebook, phone number) Register hyperlink is clickable and directed to register page | PASSED | P1 | Positive  |
| TC\_KPN\_029 | Authentication \- Valid login | Enter valid credentials Submit | User authenticated Headers shows logged-in state Redirect to homepage | BLOCKED | P1 | Positive  |
| TC\_KPN\_030 | Authentication \- Invalid password/username | Unknown user and password Submit | Error message displayed for wrong credential No session created | BLOCKED | P1 | Negative |
| TC\_KPN\_031 | Authentication \- Password field masked  | Type into password field | Character masked (hide) no plaintext in console | BLOCKED | P1 | Positive  |
| TC\_KPN\_032 | Authentication \- Session persistence  | Login  Reload | Session persists Still authenticated | BLOCKED | P2 | Positive  |
| TC\_KPN\_033 | Authentication \- logout clear session | Login Logout Press back | Back navigation does not restore an authenticated view | BLOCKED | P2 | State |
| TC\_KPN\_034 | Authentication \- Registration validation | Open /register Submit empty invalid email | Field validation messages Submit blocked No account created | BLOCKED | P2 | Positive  |
| TC\_KPN\_035 | Authentication \- Registration valid | Open /register Submit with valid email | Directed to email verification page Button resend email is enabled | BLOCKED | P1 | Positive  |
| TC\_KPN\_036 | Theme- Dark mode toggles | Click moon button | Theme switches to dark Text remain readable  | PASSED | P2 | State |
| TC\_KPN\_037 | Theme \- Dark mode persists | Enable dark mode Refresh/ reload page  Open a new tab of the same page | Preferences retained across reload and new tab | PASSED | P2 | State |
| TC\_KPN\_038 | Advert \- Ad slots render or reserve space | Load page Inspect add banner | Slot renders add No content overlap | PASSED | P3 | Positive  |
| TC\_KPN\_039 | Advert- Ad-blocked rendering | Enable ad-blocker Reload	 | No content breakage No JS exception Pag fully usable | PASSED | P2 | Negative |
| TC\_KPN\_040 | Mobile \- Mobile sites loads | Open on mobile browser or emulate on browser using Iphone 13 Open m.[kumparan.com/](http://m.kumparan.com/) | Mobile layout renders with \=\>1 card No horizontal scroll/overflow  | PASSED | P1 | Positive  |
| TC\_KPN\_041 | Mobile \- article rendering | Open news card  | Title, paragraph, and author visible Text not truncated  | PASSED | P1 | Positive  |
| TC\_KPN\_042 | Mobile \- touch target usable  | Interact with web with touch gesture | Menu open/close works via tap | PASSED | P2 | Positive  |
| TC\_KPN\_043 | Mobile \- Desktop & mobile comparity  | Compare homepage features on Desktop& mobile | Core features (headline, search, article open, theme) available on both  | PASSED | P2 | Positive  |

##   Assumptions

1. Testing is performed against the production site, no separate staging/UAT env was provided  
2. Only anonymous/public functionality is executable, no credentials were supplied  
3. Tests are non-destructive, no content is created, edited, or deleted   
4. Content is dynamic and time-sensitive  
5. No test data seeding is possible, tests use existing public content

##  Out Of Scope

| Item |
| :---- |
| Performance / load testing |
| Security Testing, auth bypass attempts |
| API testing of kumparan services |
| Native mobile apps (Android or IoS) |
| Kumparan PLUS payment/ subs purchase flow |
| Content moderation, editorial workflows |

## Dependencies

| Dependency | Impact |
| :---- | :---- |
|  QA test account (standard user) | Using production account to test |
| Publisher account  | Blocks ‘Create story’ authoring tests |
| Defined browser/device | Mobile coverage limited to emulated devices |
| A dedicated test environment | testing in production |
| Test Data | Using prod data |

## Exit Criteria

Testing is complete when all of the following meet:

1. 100%  of P1  cases executed  
2. 90% of P2 cases executed  
3. All P1 defects re-rested after fix  
4. No unexplained blocked items  
5. Execution report delivered 

## Riski Analysis

| ID | Risk | Status |
| :---- | :---- | :---- |
| 1 | Production only testing \- limitate test capability | Blocker |
| 2 | Many data-test-id is duplicated on different page | Confirmed |
|  |  |  |

