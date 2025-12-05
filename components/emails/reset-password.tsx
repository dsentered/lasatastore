import * as React from 'react';
import {
    Html,
    Head,
    Body,
    Container,
    Section,
    Text,
    Button,
    Hr,
    Tailwind,
} from '@react-email/components';

interface ForgotPasswordEmailProps {
    username: string;
    userEmail: string;
    resetLink: string;
}

const ForgotPasswordEmail = (props: ForgotPasswordEmailProps) => {
    const { username, userEmail, resetLink } = props;

    return (
        <Html lang="en" dir="ltr">
            <Tailwind>
                <Head />
                <Body className="bg-gray-100 font-sans py-[40px]">
                    <Container className="bg-white rounded-[8px] shadow-lg max-w-[600px] mx-auto p-[40px]">
                        {/* Header */}
                        <Section className="text-center mb-[32px]">
                            <Text className="text-[32px] font-bold text-gray-900 m-0">
                                Reset Your Password
                            </Text>
                        </Section>

                        {/* Main Content */}
                        <Section className="mb-[32px]">
                            <Text className="text-[16px] text-gray-700 leading-[24px] mb-[16px]">
                                Hi there,
                            </Text>

                            <Text className="text-[16px] text-gray-700 leading-[24px] mb-[16px]">
                                We received a request to reset the password for your account associated with <strong>{userEmail}</strong>.
                            </Text>

                            <Text className="text-[16px] text-gray-700 leading-[24px] mb-[32px]">
                                Click the button below to create a new password. This link will expire in 24 hours for security reasons.
                            </Text>

                            {/* Reset Password Button */}
                            <Section className="text-center mb-[32px]">
                                <Button
                                    href={resetLink}
                                    className="bg-blue-600 text-white px-[32px] py-[16px] rounded-[8px] text-[16px] font-semibold no-underline box-border hover:bg-blue-700"
                                >
                                    Reset Password
                                </Button>
                            </Section>

                            <Text className="text-[14px] text-gray-600 leading-[20px] mb-[16px]">
                                If the button above doesn't work, copy and paste this link into your browser:
                            </Text>

                            <Text className="text-[14px] text-blue-600 break-all mb-[24px]">
                                {resetLink}
                            </Text>

                            <Hr className="border-gray-200 my-[24px]" />

                            <Text className="text-[14px] text-gray-600 leading-[20px] mb-[16px]">
                                <strong>Didn't request this?</strong> If you didn't ask to reset your password, you can safely ignore this email. Your password will remain unchanged.
                            </Text>

                            <Text className="text-[14px] text-gray-600 leading-[20px]">
                                For security reasons, this password reset link will expire in 24 hours.
                            </Text>
                        </Section>

                        {/* Footer */}
                        <Hr className="border-gray-200 my-[24px]" />

                        <Section className="text-center">
                            <Text className="text-[12px] text-gray-500 leading-[16px] mb-[8px] m-0">
                                This email was sent to {userEmail}
                            </Text>

                            <Text className="text-[12px] text-gray-500 leading-[16px] mb-[8px] m-0">
                                © 2025 Your Company Name. All rights reserved.
                            </Text>

                            <Text className="text-[12px] text-gray-500 leading-[16px] m-0">
                                123 Business Street, Suite 100, City, State 12345
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default ForgotPasswordEmail;