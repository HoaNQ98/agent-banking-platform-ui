import React from 'react';
import { Form, Input, Select, DatePicker, InputNumber, Upload, Button, Typography, Divider, message } from 'antd';
import { CheckCircleOutlined, UploadOutlined, CheckOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { FormData as FormDataType, FormField, FormValues } from '../../types';
import { FORM_DEFAULTS, FILE_UPLOAD } from '../../constants';
import { formatFileSize } from '../../utils';
import { useAppStore } from '../../store/useAppStore';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface DynamicFormProps {
  form: FormDataType;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ form }) => {
  const { setFormBuilderOpen, addMessage, activeConversationId } = useAppStore();

  // Build Zod schema dynamically from form fields
  const buildSchema = (fields: FormField[]) => {
    const schemaFields: Record<string, z.ZodTypeAny> = {};

    fields.forEach((field) => {
      let fieldSchema: z.ZodTypeAny = z.string();

      // Type-specific schemas
      if (field.type === 'number' || field.type === 'currency') {
        fieldSchema = z.number();
      } else if (field.type === 'email') {
        fieldSchema = z.string().email('Invalid email address');
      } else if (field.type === 'date') {
        fieldSchema = z.date();
      }

      // Add required validation
      if (field.required) {
        if (field.type === 'number' || field.type === 'currency') {
          fieldSchema = (fieldSchema as z.ZodNumber).min(0.01, 'This field is required');
        } else {
          fieldSchema = (fieldSchema as z.ZodString).min(1, 'This field is required');
        }
      } else {
        fieldSchema = fieldSchema.optional();
      }

      schemaFields[field.name] = fieldSchema;
    });

    return z.object(schemaFields);
  };

  const schema = buildSchema(form.fields);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema) as any,
    defaultValues: form.fields.reduce((acc, field) => {
      acc[field.name] = field.defaultValue || '';
      return acc;
    }, {} as FormValues),
  });

  const onSubmit = (data: FormValues) => {
    console.log('Form submitted:', data);
    message.success('Form submitted successfully!');

    // Send confirmation message to chat
    if (activeConversationId) {
      addMessage(activeConversationId, {
        role: 'agent',
        content: 'Thank you! I\'ve received your form submission. I\'ll process this information and get back to you shortly.',
        type: 'text',
      });
    }

    // Close form builder
    setTimeout(() => {
      setFormBuilderOpen(false);
    }, 1500);
  };

  const renderField = (field: FormField) => {
    const hasError = !!errors[field.name];
    const errorMessage = errors[field.name]?.message as string;

    const commonProps = {
      placeholder: field.placeholder,
      disabled: field.disabled,
      style: hasError ? { borderColor: '#ff4d4f' } : {},
    };

    return (
      <Form.Item
        key={field.id}
        label={
          <span>
            {field.label}
            {field.required && (
              <span style={{ color: '#ff4d4f', marginLeft: '4px' }}>*</span>
            )}
          </span>
        }
        validateStatus={hasError ? 'error' : field.autoFilled ? 'success' : undefined}
        help={
          hasError ? (
            <Text type="danger">{errorMessage}</Text>
          ) : field.helperText ? (
            <Text
              type="secondary"
              style={{
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              {field.autoFilled && (
                <CheckCircleOutlined style={{ color: '#52c41a' }} />
              )}
              {field.helperText}
            </Text>
          ) : null
        }
        style={{ marginBottom: '24px' }}
      >
        <Controller
          name={field.name}
          control={control}
          render={({ field: { onChange, value } }) => {
            switch (field.type) {
              case 'textarea':
                return (
                  <TextArea
                    {...commonProps}
                    rows={4}
                    value={value as string}
                    onChange={onChange}
                  />
                );

              case 'select':
                return (
                  <Select
                    {...commonProps}
                    value={value as string}
                    onChange={onChange}
                    options={field.options}
                    suffixIcon={
                      field.autoFilled ? (
                        <CheckOutlined style={{ color: '#52c41a' }} />
                      ) : undefined
                    }
                  />
                );

              case 'date':
                return (
                  <DatePicker
                    {...commonProps}
                    style={{ width: '100%', ...commonProps.style }}
                    value={value as any}
                    onChange={onChange}
                    format={FORM_DEFAULTS.DATE_FORMAT}
                  />
                );

              case 'currency':
                return (
                  <InputNumber
                    {...commonProps}
                    style={{ width: '100%', ...commonProps.style }}
                    value={value as number}
                    onChange={onChange}
                    prefix={field.currencySymbol || FORM_DEFAULTS.CURRENCY_SYMBOL}
                    suffix={field.currencyCode || FORM_DEFAULTS.CURRENCY_CODE}
                    min={0}
                    precision={2}
                    formatter={(val) =>
                      val ? `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''
                    }
                  />
                );

              case 'number':
                return (
                  <InputNumber
                    {...commonProps}
                    style={{ width: '100%', ...commonProps.style }}
                    value={value as number}
                    onChange={onChange}
                    min={0}
                  />
                );

              case 'email':
                return (
                  <Input
                    {...commonProps}
                    type="email"
                    value={value as string}
                    onChange={onChange}
                    suffix={
                      field.autoFilled ? (
                        <CheckOutlined style={{ color: '#52c41a' }} />
                      ) : undefined
                    }
                  />
                );

              case 'file':
                return (
                  <Upload
                    beforeUpload={() => false}
                    accept={field.accept || FILE_UPLOAD.ALLOWED_EXTENSIONS.join(',')}
                    maxCount={1}
                    onChange={(info) => {
                      onChange(info.fileList[0]?.originFileObj);
                    }}
                  >
                    <div
                      style={{
                        border: '2px dashed #d9d9d9',
                        borderRadius: '6px',
                        padding: '24px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#1890ff';
                        e.currentTarget.style.backgroundColor = '#e6f7ff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#d9d9d9';
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <UploadOutlined
                        style={{ fontSize: '24px', color: '#bfbfbf', marginBottom: '8px' }}
                      />
                      <Text style={{ display: 'block' }}>Upload Document</Text>
                      <Text type="secondary" style={{ fontSize: '13px' }}>
                        or drag and drop
                      </Text>
                      <Text
                        type="secondary"
                        style={{ fontSize: '11px', display: 'block', marginTop: '4px' }}
                      >
                        {field.accept || 'PDF, PNG, JPG'} (max{' '}
                        {formatFileSize(field.maxSize || FILE_UPLOAD.MAX_SIZE)})
                      </Text>
                    </div>
                  </Upload>
                );

              default:
                return (
                  <Input
                    {...commonProps}
                    value={value as string}
                    onChange={onChange}
                    suffix={
                      field.autoFilled ? (
                        <CheckOutlined style={{ color: '#52c41a' }} />
                      ) : undefined
                    }
                  />
                );
            }
          }}
        />
      </Form.Item>
    );
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* Form Header */}
      <div style={{ marginBottom: '24px' }}>
        <Title level={4} style={{ marginBottom: '8px' }}>
          {form.title}
        </Title>
        {form.description && (
          <Text type="secondary" style={{ fontSize: '14px' }}>
            {form.description}
          </Text>
        )}
      </div>

      <Divider />

      {/* Dynamic Form Fields */}
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        {form.fields.map((field) => renderField(field))}

        <Divider />

        {/* Form Actions */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <Button size="large" onClick={() => setFormBuilderOpen(false)}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" size="large">
            Submit Form
          </Button>
        </div>

        {/* Footer Security Notice */}
        <div
          style={{
            marginTop: '24px',
            paddingTop: '24px',
            borderTop: '1px solid #f0f0f0',
            textAlign: 'center',
          }}
        >
          <Text type="secondary" style={{ fontSize: '13px' }}>
            🔒 Your information is encrypted and secure
          </Text>
        </div>
      </Form>
    </div>
  );
};

export default DynamicForm;
