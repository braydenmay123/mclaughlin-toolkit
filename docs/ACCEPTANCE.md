# McLaughlin Financial Group Platform - Acceptance Checklist

## Manual Testing Checklist

### 1. Gating System
- [ ] **Calculators Gate**
  - Navigate to home page
  - Click "Calculators" button
  - Verify gate modal appears with form fields
  - Fill out form with valid data and accept terms
  - Submit form
  - Verify redirect to calculators page
  - Verify advisor receives email notification
  - Return to home and click "Calculators" again
  - Verify direct access (no gate) within 30-day window

- [ ] **Education Gate**
  - Click "Education Centre" button from home
  - Verify gate modal appears
  - Submit form with different data
  - Verify redirect to education center
  - Verify 30-day remember functionality works

### 2. Education Centre
- [ ] **Section Navigation**
  - Verify all sections are collapsible/expandable
  - Verify "Foundational Topics" section expands by default
  - Click on different sections to expand/collapse
  - Verify chapter cards display correctly with descriptions and duration

- [ ] **Chapter Content**
  - Click on "Investing Basics" chapter
  - Verify slide navigation works (Next/Previous buttons)
  - Verify progress bar and dots update correctly
  - Verify slide content displays properly

- [ ] **Compound Growth Chapter**
  - Navigate to "Power of Compound Growth" chapter
  - Verify chart renders on slide 2
  - Verify chart shows comparison data correctly
  - Complete all slides and verify "Complete" button returns to education center

### 3. Interactive Asset Mapping
- [ ] **Initial Load**
  - Click "Interactive Asset Mapping" from home (no gate required)
  - Verify portfolio summary shows $0 for all categories initially
  - Verify asset and liability categories display correctly

- [ ] **Adding Items**
  - Click "Add Item" on any asset category
  - Fill out item form with valid data
  - Save item and verify it appears in the category
  - Verify portfolio summary updates correctly
  - Add items to liability categories
  - Verify net worth calculation is correct (assets - liabilities)

- [ ] **Editing/Deleting Items**
  - Click edit icon on an existing item
  - Modify data and save
  - Verify changes are reflected
  - Delete an item and confirm deletion
  - Verify portfolio summary updates

- [ ] **Data Persistence**
  - Add several items across different categories
  - Refresh the page/app
  - Verify all data persists correctly
  - Test "Reset Data" functionality
  - Confirm all data is cleared after reset

### 4. Contact Form Integration
- [ ] **Form Submission**
  - Submit gate form with valid data
  - Check that advisor receives email at info@mclaughlinfinancial.ca
  - Verify email contains all submitted information
  - Verify email subject follows format: "Platform Contact — {interest} — {name}"

- [ ] **Error Handling**
  - Try submitting form with missing required fields
  - Verify appropriate error messages display
  - Test with invalid email format
  - Verify form validation works correctly

### 5. Web Compatibility
- [ ] **Browser Testing**
  - Test on Chrome, Firefox, Safari
  - Verify all functionality works on web
  - Verify responsive design on different screen sizes
  - Test touch interactions work properly

- [ ] **Mobile Web**
  - Test on mobile browsers
  - Verify gate modal displays correctly
  - Verify education slides are readable
  - Verify asset mapping interface is usable

### 6. Build and Deploy
- [ ] **Vercel Build**
  - Run `npm run vercel-build`
  - Verify build completes without errors
  - Verify post-build scripts run successfully
  - Check that protected files remain unchanged

- [ ] **Production Testing**
  - Deploy to Vercel
  - Test all functionality in production environment
  - Verify email delivery works in production
  - Test performance and loading times

## Expected Behavior Summary

### Gating Flow
1. User clicks "Calculators" or "Education Centre" from home
2. Gate modal appears requesting contact information
3. User fills form and accepts terms
4. Form submits to `/api/contact` endpoint
5. Advisor receives email notification
6. User is redirected to requested section
7. Gate state is stored locally for 30 days

### Education Centre
1. Sections display in collapsible format
2. Chapters show duration and description
3. Slide navigation works smoothly
4. Charts render correctly where included
5. Progress indicators update properly

### Asset Mapping
1. Categories display with add/edit functionality
2. Items can be added, edited, and deleted
3. Portfolio summary calculates correctly
4. Data persists across sessions
5. Reset functionality clears all data

### Contact Integration
1. Forms submit successfully
2. Emails are delivered to advisor
3. Error handling works properly
4. Rate limiting prevents abuse

## Notes
- All data in asset mapping is stored locally (localStorage/AsyncStorage)
- Gate state expires after 30 days
- Email delivery requires RESEND_API_KEY environment variable
- Fallback logging is used if email service is not configured