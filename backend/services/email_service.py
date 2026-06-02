import os
from dotenv import load_dotenv
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig

load_dotenv()

conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("EMAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("EMAIL_PASSWORD"),
    MAIL_FROM=os.getenv("EMAIL_FROM"),
    MAIL_PORT=int(os.getenv("EMAIL_PORT")),
    MAIL_SERVER=os.getenv("EMAIL_SERVER"),
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True
)

async def send_password_reset_email(email: str, reset_link: str):
    message = MessageSchema(
        subject="Reset Your Password",
        recipients=[email],
        body=f"""
        <html>
            <body style="
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                padding: 40px;
            ">

                <div style="
                    max-width: 600px;
                    background-color: white;
                    margin: auto;
                    padding: 40px;
                    border-radius: 10px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                ">

                    <h2 style="
                        color: #333333;
                        text-align: center;
                        margin-bottom: 30px;
                    ">
                        Reset Your Password
                    </h2>

                    <p style="
                        color: #555555;
                        font-size: 16px;
                        line-height: 1.6;
                    ">
                        A password reset was requested for your account.
                    </p>

                    <p style="
                        color: #555555;
                        font-size: 16px;
                        line-height: 1.6;
                    ">
                        Click the button below to reset your password:
                    </p>

                    <div style="
                        text-align: center;
                        margin: 30px 0;
                    ">
                        <a
                            href="{reset_link}"
                            style="
                                background-color: #2563eb;
                                color: white;
                                padding: 14px 28px;
                                text-decoration: none;
                                border-radius: 8px;
                                font-size: 16px;
                                display: inline-block;
                            "
                        >
                            Reset Password
                        </a>
                    </div>

                    <p style="
                        color: #777777;
                        font-size: 14px;
                    ">
                        This link will expire in
                        <strong>15 minutes</strong>.
                    </p>

                    <p style="
                        color: #777777;
                        font-size: 14px;
                    ">
                        If you did not request this,
                        please ignore this email.
                    </p>

                    <hr style="
                        border: none;
                        border-top: 1px solid #eeeeee;
                        margin: 30px 0;
                    ">

                    <p style="
                        color: #999999;
                        font-size: 13px;
                        text-align: center;
                    ">
                        Clinic Management System
                    </p>

                </div>

            </body>
        </html>
        """,
        subtype="html"
    )

    fm = FastMail(conf)

    await fm.send_message(message)
