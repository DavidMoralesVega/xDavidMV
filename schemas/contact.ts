import { z } from "zod";

/**
 * Schema de validación para formulario de contacto
 * - Validación robusta con mensajes en español
 * - Protección anti-spam con honeypot
 * - Sanitización de entrada
 * - Límites de caracteres para prevenir abuso
 */

// Regex para teléfono (formato internacional flexible)
const phoneRegex = /^[\d\s()+-]+$/;

// Lista de dominios de email desechables/spam
const disposableEmailDomains = [
  'tempmail.com', 'guerrillamail.com', '10minutemail.com',
  'throwaway.email', 'mailinator.com', 'temp-mail.org'
];

export const contactSchema = z.object({
  // Campo honeypot (debe estar vacío)
  website: z.string().max(0, "Campo no válido").optional(),

  // Nombre: requerido, entre 2-100 caracteres
  Name: z.string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre es muy largo")
    .trim()
    .refine(
      (name) => !/^[\d\s]+$/.test(name),
      "El nombre no puede contener solo números"
    ),

  // Empresa: opcional, máximo 150 caracteres
  Company: z.string()
    .max(150, "El nombre de empresa es muy largo")
    .trim()
    .optional(),

  // Email: validación robusta
  "E-mail": z.string()
    .email("Email inválido")
    .max(255, "Email muy largo")
    .toLowerCase()
    .trim()
    .refine(
      (email) => {
        const domain = email.split('@')[1];
        return !disposableEmailDomains.includes(domain);
      },
      "Email desechable no permitido"
    )
    .refine(
      (email) => !email.includes('+'), // Previene email+spam@domain.com
      "Formato de email no permitido"
    ),

  // Teléfono: opcional, validación flexible
  Phone: z.string()
    .max(20, "Teléfono muy largo")
    .trim()
    .refine(
      (phone) => phone === '' || phoneRegex.test(phone),
      "Formato de teléfono inválido"
    )
    .optional(),

  // Mensaje: requerido, entre 10-2000 caracteres
  Message: z.string()
    .min(10, "El mensaje debe tener al menos 10 caracteres")
    .max(2000, "El mensaje no puede exceder 2000 caracteres")
    .trim()
    .refine(
      (msg) => msg.split(/\s+/).length >= 3,
      "El mensaje debe tener al menos 3 palabras"
    )
    .refine(
      (msg) => !/(viagra|cialis|casino|lottery)/i.test(msg),
      "Contenido no permitido detectado"
    ),
});

export type ContactForm = z.infer<typeof contactSchema>;
