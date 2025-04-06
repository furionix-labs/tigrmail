"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailtiger = void 0;
const mailtiger = ({ linkSelector }) => {
    // Get the email address from the page
    const getEmailAddress = () => {
        // This is a placeholder implementation
        // In a real implementation, you would extract the email from the page
        return 'test@email.com';
    };
    // Get the verification link from the page
    const getVerificationLink = () => {
        return new Promise((resolve) => {
            // This is a placeholder implementation
            // In a real implementation, you would:
            // 1. Find the element using the provided selector
            // 2. Extract the href attribute
            // 3. Return the link
            resolve('http://example.com');
        });
    };
    return {
        emailAddress: getEmailAddress(),
        verificationLinkPromise: getVerificationLink(),
    };
};
exports.mailtiger = mailtiger;
