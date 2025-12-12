import { describe, it, expect } from 'vitest';
import { contactSchema } from '@/schemas/contact';

describe('Contact Form Schema Validation', () => {
  describe('Name field', () => {
    it('should accept valid names', () => {
      const validData = {
        Name: 'Juan Pérez',
        'E-mail': 'juan@example.com',
        Message: 'Este es un mensaje válido de prueba'
      };
      expect(() => contactSchema.parse(validData)).not.toThrow();
    });

    it('should reject names shorter than 2 characters', () => {
      const invalidData = {
        Name: 'J',
        'E-mail': 'juan@example.com',
        Message: 'Este es un mensaje válido'
      };
      expect(() => contactSchema.parse(invalidData)).toThrow();
    });

    it('should reject names with only numbers', () => {
      const invalidData = {
        Name: '12345',
        'E-mail': 'juan@example.com',
        Message: 'Este es un mensaje válido'
      };
      expect(() => contactSchema.parse(invalidData)).toThrow();
    });

    it('should trim whitespace from names', () => {
      const data = {
        Name: '  Juan Pérez  ',
        'E-mail': 'juan@example.com',
        Message: 'Este es un mensaje válido'
      };
      const result = contactSchema.parse(data);
      expect(result.Name).toBe('Juan Pérez');
    });
  });

  describe('Email field', () => {
    it('should accept valid email addresses', () => {
      const validEmails = [
        'user@example.com',
        'john.doe@company.co.uk',
        'test_user@domain.org'
      ];

      validEmails.forEach(email => {
        const data = {
          Name: 'Test User',
          'E-mail': email,
          Message: 'Test message here'
        };
        expect(() => contactSchema.parse(data)).not.toThrow();
      });
    });

    it('should reject invalid email formats', () => {
      const invalidEmails = [
        'notanemail',
        '@example.com',
        'user@',
        'user @example.com'
      ];

      invalidEmails.forEach(email => {
        const data = {
          Name: 'Test User',
          'E-mail': email,
          Message: 'Test message'
        };
        expect(() => contactSchema.parse(data)).toThrow();
      });
    });

    it('should reject disposable email domains', () => {
      const disposableEmails = [
        'test@tempmail.com',
        'user@guerrillamail.com',
        'spam@10minutemail.com'
      ];

      disposableEmails.forEach(email => {
        const data = {
          Name: 'Test User',
          'E-mail': email,
          Message: 'Test message'
        };
        expect(() => contactSchema.parse(data)).toThrow();
      });
    });

    it('should convert email to lowercase', () => {
      const data = {
        Name: 'Test User',
        'E-mail': 'USER@EXAMPLE.COM',
        Message: 'Test message here'
      };
      const result = contactSchema.parse(data);
      expect(result['E-mail']).toBe('user@example.com');
    });

    it('should reject emails with + character', () => {
      const data = {
        Name: 'Test User',
        'E-mail': 'user+spam@example.com',
        Message: 'Test message'
      };
      expect(() => contactSchema.parse(data)).toThrow();
    });
  });

  describe('Phone field', () => {
    it('should accept valid phone formats', () => {
      const validPhones = [
        '+591 61816001',
        '(591) 61816001',
        '591-618-16001',
        '61816001'
      ];

      validPhones.forEach(phone => {
        const data = {
          Name: 'Test User',
          'E-mail': 'test@example.com',
          Phone: phone,
          Message: 'Este es un mensaje válido de prueba'
        };
        expect(() => contactSchema.parse(data)).not.toThrow();
      });
    });

    it('should reject invalid phone characters', () => {
      const data = {
        Name: 'Test User',
        'E-mail': 'test@example.com',
        Phone: '591abc61816001',
        Message: 'Test message'
      };
      expect(() => contactSchema.parse(data)).toThrow();
    });

    it('should be optional', () => {
      const data = {
        Name: 'Test User',
        'E-mail': 'test@example.com',
        Message: 'Este es un mensaje válido de prueba'
      };
      expect(() => contactSchema.parse(data)).not.toThrow();
    });
  });

  describe('Message field', () => {
    it('should accept valid messages', () => {
      const data = {
        Name: 'Test User',
        'E-mail': 'test@example.com',
        Message: 'Este es un mensaje válido con suficiente contenido'
      };
      expect(() => contactSchema.parse(data)).not.toThrow();
    });

    it('should reject messages shorter than 10 characters', () => {
      const data = {
        Name: 'Test User',
        'E-mail': 'test@example.com',
        Message: 'Hola'
      };
      expect(() => contactSchema.parse(data)).toThrow();
    });

    it('should reject messages with less than 3 words', () => {
      const data = {
        Name: 'Test User',
        'E-mail': 'test@example.com',
        Message: 'Mensaje corto'
      };
      expect(() => contactSchema.parse(data)).toThrow();
    });

    it('should reject spam keywords', () => {
      const spamKeywords = ['viagra', 'cialis', 'casino', 'lottery'];

      spamKeywords.forEach(keyword => {
        const data = {
          Name: 'Test User',
          'E-mail': 'test@example.com',
          Message: `This message contains ${keyword} and should be rejected`
        };
        expect(() => contactSchema.parse(data)).toThrow();
      });
    });

    it('should trim whitespace from message', () => {
      const data = {
        Name: 'Test User',
        'E-mail': 'test@example.com',
        Message: '   Este es un mensaje de prueba   '
      };
      const result = contactSchema.parse(data);
      expect(result.Message).toBe('Este es un mensaje de prueba');
    });
  });

  describe('Honeypot field', () => {
    it('should accept when honeypot is empty', () => {
      const data = {
        Name: 'Test User',
        'E-mail': 'test@example.com',
        Message: 'Este es un mensaje válido',
        website: ''
      };
      expect(() => contactSchema.parse(data)).not.toThrow();
    });

    it('should reject when honeypot is filled', () => {
      const data = {
        Name: 'Test User',
        'E-mail': 'test@example.com',
        Message: 'Este es un mensaje válido',
        website: 'http://spam.com'
      };
      expect(() => contactSchema.parse(data)).toThrow();
    });
  });

  describe('Full form validation', () => {
    it('should accept complete valid form', () => {
      const validForm = {
        Name: 'David Morales',
        Company: 'BeMoreX',
        'E-mail': 'contact@bemorex.com',
        Phone: '+591 61816001',
        Message: 'Me gustaría contactarte para discutir un proyecto de desarrollo web con Angular y NestJS'
      };
      expect(() => contactSchema.parse(validForm)).not.toThrow();
    });

    it('should accept minimal valid form', () => {
      const minimalForm = {
        Name: 'Juan Pérez',
        'E-mail': 'juan@example.com',
        Message: 'Mensaje de prueba válido para contacto'
      };
      expect(() => contactSchema.parse(minimalForm)).not.toThrow();
    });
  });
});
