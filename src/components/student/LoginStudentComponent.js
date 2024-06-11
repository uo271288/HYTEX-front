import { useTranslation } from 'react-i18next';
import { Button, Card, Input, Form, Alert } from "antd";
import { usersServiceURL } from '../../Globals';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

let LoginStudent = (props) => {

    let { setLogin } = props;

    let { t } = useTranslation();

    let [message, setMessage] = useState(null);

    let navigate = useNavigate();

    let onFinish = async (values) => {
        let { username } = values;

        let response = null;
        try {
            response = await fetch(usersServiceURL + "/students/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username
                })
            });
        } catch (e) {
            setMessage({ error: { type: "internalServerError", message: e } });
            return;
        }

        let jsonData = await response?.json();
        if (response?.ok) {
            if (jsonData?.apiKey != null) {
                localStorage.setItem("apiKey", jsonData.apiKey);
                localStorage.setItem("name", jsonData.name);
                localStorage.setItem("idUser", jsonData.id);
                localStorage.setItem("username", jsonData.username);
                localStorage.setItem("role", "S");
                setLogin(true);
                navigate("/students/exercises");
            }
        } else {
            setMessage({ error: jsonData?.error });
        }
    };

    return (
        <Card title={t("login.title")} style={{ width: "80vw" }}>
            {message?.error?.type && <Alert type="error" message={t(message?.error?.type)} showIcon style={{ marginBottom: "1vh" }} />}
            <Form
                name="login"
                labelCol={{ xs: { span: 24 }, sm: { span: 6 } }}
                wrapperCol={{ xs: { span: 24 }, sm: { span: 18 } }}
                onFinish={onFinish}
                scrollToFirstError
            >
                <Form.Item
                    name="username"
                    label={t("login.form.label.username")}
                    rules={[
                        {
                            required: true,
                            message: t("login.error.username.empty")
                        },
                    ]}
                    validateStatus={message?.error?.username ? 'error' : undefined}
                    help={message?.error?.username ? t(message?.error?.username) : undefined}
                    hasFeedback
                >
                    <Input placeholder={t("login.form.placeholder.username")} onInput={() => setMessage(null)} />
                </Form.Item>
                <Form.Item wrapperCol={{ xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 6 } }}>
                    <Button type="primary" htmlType="submit">
                        {t("login.button")}
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default LoginStudent;