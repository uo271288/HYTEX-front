import { Button, Form, Input, Card, Alert, Cascader, Image } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { arasaacURL, exercisesServiceURL } from '../../Globals';
import SelectImageModal from './SelectImageModalComponent';
import i18n from "../../i18n";

let CreateExercise = ({ isMobile }) => {

    const lng = i18n.language;

    let { t } = useTranslation();

    let [message, setMessage] = useState(null);
    let [openMain, setOpenMain] = useState(false);
    let [openDefinition, setOpenDefinition] = useState(false);
    let [openAmpliation, setOpenAmpliation] = useState(false);
    let [selectedMainImages, setSelectedMainImages] = useState([]);
    let [selectedDefinitionImages, setSelectedDefinitionImages] = useState([]);
    let [selectedAmpliationImages, setSelectedAmpliationImages] = useState([]);
    let [networkType, setNetworkType] = useState(null);
    let [representation, setRepresentation] = useState(null);
    let [selectedLanguage, setSelectedLanguage] = useState(lng.split("-")[0]);

    let navigate = useNavigate();

    let showModalMain = () => {
        setOpenMain(true);
    };
    let showModalDefinition = () => {
        setOpenDefinition(true);
    };
    let showModalAmpliation = () => {
        setOpenAmpliation(true);
    };

    let onFinish = async (values) => {
        let { title, language, category, networkType, representation, definitionText, ampliationText, definitionPictogram, ampliationPictogram } = values;

        let response = null;
        try {
            response = await fetch(exercisesServiceURL + `/exercises?apiKey=${localStorage.getItem("apiKey")}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: title.toUpperCase(),
                    language: language[0],
                    category: category[0],
                    networkType: networkType[0],
                    representation: representation[0],
                    mainImage: selectedMainImages ? selectedMainImages[0] : undefined,
                    definitionText: definitionText ? definitionText.toUpperCase() : undefined,
                    definitionImage: selectedDefinitionImages ? selectedDefinitionImages[0] : undefined,
                    ampliationText: ampliationText ? ampliationText.toUpperCase() : undefined,
                    ampliationImages: selectedAmpliationImages ? selectedAmpliationImages : undefined,
                    definitionPictogram: definitionPictogram[0],
                    ampliationPictogram: ampliationPictogram[0]
                })
            });
        } catch (e) {
            setMessage({ error: { type: "internalServerError", message: e } });
            return;
        }

        let jsonData = await response?.json();
        if (response?.ok) {
            navigate("/teachers/manageExercises");
        } else {
            setMessage({ error: jsonData?.error });
        }
    };

    const networkTypeOptions = [
        { value: 'I-I', label: 'I-I' },
        { value: 'I-II', label: 'I-II' },
        { value: 'I-III', label: 'I-III' },
    ];

    const representationOptions = [
        { value: 'ICONIC', label: 'ICONIC' },
        { value: 'MIXED', label: 'MIXED' },
        { value: 'SYMBOLIC', label: 'SYMBOLIC' },
    ];

    const categoryOptions = [
        { value: 'Body', label: 'Body' },
        { value: 'Food', label: 'Food' },
        { value: 'Animals', label: 'Animals' },
    ];

    const languageOptions = [
        { value: 'es', label: 'Español' },
        { value: 'en', label: 'English' },
    ];

    const definitionPictogramOptions = [
        { value: 'is', label: <><Image width={20} src='/pictograms/is.png' /> {t("pictograms.is", { lng: selectedLanguage })}</> },
        { value: 'isFor', label: <><Image width={20} src='/pictograms/isFor.png' /> {t("pictograms.isFor", { lng: selectedLanguage })}</> },
        { value: 'isPartOf', label: <><Image width={20} src='/pictograms/isPartOf.png' /> {t("pictograms.isPartOf", { lng: selectedLanguage })}</> },
        { value: 'are', label: <><Image width={20} src='/pictograms/are.png' /> {t("pictograms.are", { lng: selectedLanguage })}</> },
        { value: 'areFor', label: <><Image width={20} src='/pictograms/areFor.png' /> {t("pictograms.areFor", { lng: selectedLanguage })}</> },
        { value: 'arePartOf', label: <><Image width={20} src='/pictograms/arePartOf.png' /> {t("pictograms.arePartOf", { lng: selectedLanguage })}</> }
    ];

    const ampliationPictogramOptions = [
        { value: 'has', label: <><Image width={20} src='/pictograms/has.png' /> {t("pictograms.has", { lng: selectedLanguage })}</> },
        { value: 'isUsedFor', label: <><Image width={20} src='/pictograms/isUsedFor.png' /> {t("pictograms.isUsedFor", { lng: selectedLanguage })}</> },
        { value: 'isIn', label: <><Image width={20} src='/pictograms/isIn.png' /> {t("pictograms.isIn", { lng: selectedLanguage })}</> },
        { value: 'have', label: <><Image width={20} src='/pictograms/have.png' /> {t("pictograms.have", { lng: selectedLanguage })}</> },
        { value: 'areUsedFor', label: <><Image width={20} src='/pictograms/areUsedFor.png' /> {t("pictograms.areUsedFor", { lng: selectedLanguage })}</> },
        { value: 'areIn', label: <><Image width={20} src='/pictograms/areIn.png' /> {t("pictograms.areIn", { lng: selectedLanguage })}</> }
    ];

    const getSelectionLimit = (networkType) => {
        switch (networkType) {
            case 'I-I':
                return 1;
            case 'I-II':
                return 2;
            case 'I-III':
                return 3;
            default:
                return 1;
        }
    };

    return (
        <Card title={t("exercise.create.title")} style={{ width: isMobile ? "90vw" : "65vw", marginTop: "2vh" }}>
            {message?.error?.type && <Alert type="error" message={t(message?.error?.type)} showIcon style={{ marginBottom: "1vh" }} />}
            <Form
                name="register"
                labelCol={{
                    xs: {
                        span: 24,
                    },
                    sm: {
                        span: 10,
                    },
                }}
                wrapperCol={{
                    xs: {
                        span: 24,
                    },
                    sm: {
                        span: 16,
                    },
                }}
                onFinish={onFinish}
                scrollToFirstError
            >
                <Form.Item
                    name="title"
                    label={t("exercise.create.label.title")}
                    rules={[
                        { required: true, message: t("exercise.create.error.title"), whitespace: true }
                    ]}
                    validateStatus={message?.error?.name ? 'error' : undefined}
                    help={message?.error?.name ? t(message?.error?.name) : undefined}
                    hasFeedback
                    wrapperCol={{ xs: { span: 18 }, sm: { span: 10 }, md: { span: 12 }, lg: { span: 9 }, xl: { span: 7 } }}
                >
                    <Input placeholder={t("exercise.create.placeholder.title")} onInput={() => setMessage(null)} />
                </Form.Item>
                <Form.Item
                    name="language"
                    label={t("exercise.create.label.language")}
                    rules={[
                        { required: true, message: t("exercise.create.error.language") }
                    ]}
                    validateStatus={message?.error?.lastName ? 'error' : undefined}
                    help={message?.error?.lastName ? t(message?.error?.lastName) : undefined}
                    hasFeedback
                    wrapperCol={{ xs: { span: 14 }, sm: { span: 10 }, md: { span: 9 }, lg: { span: 7 }, xl: { span: 5 } }}
                >
                    <Cascader options={languageOptions} placeholder={t("exercise.create.placeholder.language")} onChange={(value) => setSelectedLanguage(value ? value[0] : i18n.language.split("-")[0])} />
                </Form.Item>
                <Form.Item
                    name="category"
                    label={t("exercise.create.label.category")}
                    rules={[
                        { required: true, message: t("exercise.create.error.category") }
                    ]}
                    validateStatus={message?.error?.name ? 'error' : undefined}
                    help={message?.error?.name ? t(message?.error?.name) : undefined}
                    hasFeedback
                    wrapperCol={{ xs: { span: 16 }, sm: { span: 12 }, md: { span: 9 }, lg: { span: 8 }, xl: { span: 5 } }}
                >
                    <Cascader options={categoryOptions} placeholder={t("exercise.create.placeholder.category")} />
                </Form.Item>
                <Form.Item
                    name="networkType"
                    label={t("exercise.create.label.networkType")}
                    rules={[
                        { required: true, message: t("exercise.create.error.networkType") }
                    ]}
                    validateStatus={message?.error?.lastName ? 'error' : undefined}
                    help={message?.error?.lastName ? t(message?.error?.lastName) : undefined}
                    hasFeedback
                    wrapperCol={{ xs: { span: 17 }, sm: { span: 12 }, md: { span: 10 }, lg: { span: 8 }, xl: { span: 6 } }}
                >
                    <Cascader
                        options={networkTypeOptions}
                        placeholder={t("exercise.create.placeholder.networkType")}
                        onChange={(value) => value && setNetworkType(value[0])}
                    />
                </Form.Item>
                <Form.Item
                    name="representation"
                    label={t("exercise.create.label.representation")}
                    rules={[
                        { required: true, message: t("exercise.create.error.representation") }
                    ]}
                    validateStatus={message?.error?.lastName ? 'error' : undefined}
                    help={message?.error?.lastName ? t(message?.error?.lastName) : undefined}
                    hasFeedback
                    wrapperCol={{ xs: { span: 21 }, sm: { span: 16 }, md: { span: 12 }, lg: { span: 10 }, xl: { span: 7 } }}
                >
                    <Cascader options={representationOptions} placeholder={t("exercise.create.placeholder.representation")} onChange={(value) => value && setRepresentation(value[0])} />
                </Form.Item>
                {["ICONIC", "MIXED"].includes(representation) && <Form.Item
                    name="mainImage"
                    label={t("exercise.create.label.mainImage")}
                    required
                    validateStatus={selectedMainImages.length === 0 && message?.error?.mainImage ? 'error' : ''}
                    help={selectedMainImages.length === 0 && message?.error?.mainImage ? t(message?.error?.mainImage) : undefined}
                >
                    <div>
                        {selectedMainImages && selectedMainImages.map(image =>
                            <Image key={image} preview={false} width="4vmax" src={`${arasaacURL}/pictograms/${image}`} />
                        )}
                        <Button ghost type="primary" onClick={showModalMain}>
                            Select mainImage
                        </Button>
                    </div>
                </Form.Item>}
                {["MIXED", "SYMBOLIC"].includes(representation) && <Form.Item
                    name="definitionText"
                    label={t("exercise.create.label.definitionText")}
                    rules={[
                        { required: true, message: t("exercise.create.error.definitionText"), whitespace: true }
                    ]}
                    validateStatus={message?.error?.name ? 'error' : undefined}
                    help={message?.error?.name ? t(message?.error?.name) : undefined}
                    hasFeedback
                    wrapperCol={{ xs: { span: 18 }, sm: { span: 12 }, md: { span: 11 }, lg: { span: 9 }, xl: { span: 6 } }}
                >
                    <Input placeholder={t("exercise.create.placeholder.definitionText")} onInput={() => setMessage(null)} />
                </Form.Item>}
                {["ICONIC", "MIXED"].includes(representation) && <Form.Item
                    name="definitionImage"
                    required
                    label={t("exercise.create.label.definitionImage")}
                    validateStatus={selectedDefinitionImages.length === 0 && message?.error?.definitionImage ? 'error' : ''}
                    help={selectedDefinitionImages.length === 0 && message?.error?.definitionImage ? t(message?.error?.definitionImage) : undefined}
                >
                    <div>
                        {selectedDefinitionImages && selectedDefinitionImages.map(image =>
                            <Image key={image} preview={false} width="4vmax" src={`${arasaacURL}/pictograms/${image}`} />
                        )}
                        <Button ghost type="primary" onClick={showModalDefinition}>
                            Select definitionImage
                        </Button>
                    </div>
                </Form.Item>}
                {["MIXED", "SYMBOLIC"].includes(representation) && <Form.Item
                    name="ampliationText"
                    label={t("exercise.create.label.ampliationText")}
                    rules={[
                        { required: true, message: t("exercise.create.error.ampliationText"), whitespace: true }
                    ]}
                    validateStatus={message?.error?.name ? 'error' : undefined}
                    help={message?.error?.name ? t(message?.error?.name) : undefined}
                    hasFeedback
                    wrapperCol={{ xs: { span: 18 }, sm: { span: 12 }, md: { span: 11 }, lg: { span: 9 }, xl: { span: 6 } }}
                >
                    <Input placeholder={t("exercise.create.placeholder.ampliationText")} onInput={() => setMessage(null)} />
                </Form.Item>}
                {["ICONIC", "MIXED"].includes(representation) && <Form.Item
                    name="ampliationImages"
                    required
                    label={t("exercise.create.label.ampliationImage")}
                    validateStatus={selectedAmpliationImages.length === 0 && message?.error?.ampliationImages ? 'error' : ''}
                    help={selectedAmpliationImages.length === 0 && message?.error?.ampliationImages ? t(message?.error?.ampliationImages) : undefined}
                >
                    <div>
                        {selectedAmpliationImages && selectedAmpliationImages.map(image =>
                            <Image key={image} preview={false} width="4vmax" src={`${arasaacURL}/pictograms/${image}`} />
                        )}
                        <Button ghost type="primary" onClick={showModalAmpliation}>
                            Select ampliationImage
                        </Button>
                    </div>
                </Form.Item>}
                <Form.Item
                    name="definitionPictogram"
                    label={t("exercise.create.label.definitionPictogram")}
                    rules={[
                        { required: true, message: t("exercise.create.error.definitionPictogram") }
                    ]}
                    validateStatus={message?.error?.lastName ? 'error' : undefined}
                    help={message?.error?.lastName ? t(message?.error?.lastName) : undefined}
                    hasFeedback
                    wrapperCol={{ xs: { span: 24 }, sm: { span: 18 }, md: { span: 14 }, lg: { span: 11 }, xl: { span: 8 } }}
                >
                    <Cascader options={definitionPictogramOptions} placeholder={t("exercise.create.placeholder.definitionPictogram")} />
                </Form.Item>
                <Form.Item
                    name="ampliationPictogram"
                    label={t("exercise.create.label.ampliationPictogram")}
                    rules={[
                        { required: true, message: t("exercise.create.error.ampliationPictogram") }
                    ]}
                    validateStatus={message?.error?.lastName ? 'error' : undefined}
                    help={message?.error?.lastName ? t(message?.error?.lastName) : undefined}
                    hasFeedback
                    wrapperCol={{ xs: { span: 24 }, sm: { span: 18 }, md: { span: 14 }, lg: { span: 11 }, xl: { span: 8 } }}
                >
                    <Cascader options={ampliationPictogramOptions} placeholder={t("exercise.create.placeholder.ampliationPictogram")} />
                </Form.Item>
                <Form.Item style={{ float: "right" }}>
                    <Button type="primary" htmlType="submit">
                        {t("exercise.create.button")}
                    </Button>
                </Form.Item>
            </Form>
            <SelectImageModal setMessage={setMessage} setOpen={setOpenMain} open={openMain} selectedImages={selectedMainImages} setSelectedImages={setSelectedMainImages} selectionLimit={1} />
            <SelectImageModal setMessage={setMessage} setOpen={setOpenDefinition} open={openDefinition} selectedImages={selectedDefinitionImages} setSelectedImages={setSelectedDefinitionImages} selectionLimit={1} />
            <SelectImageModal setMessage={setMessage} setOpen={setOpenAmpliation} open={openAmpliation} selectedImages={selectedAmpliationImages} setSelectedImages={setSelectedAmpliationImages} selectionLimit={getSelectionLimit(networkType)} />
        </Card >
    );
};
export default CreateExercise;