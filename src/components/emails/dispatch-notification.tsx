/* eslint-disable react/jsx-no-comment-textnodes */
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface DispatchNotificationProps {
  userName: string;
  userEmail: string;
  type: "issue" | "feedback";
  title: string;
  text: string;
  imageUrl?: string;
  traceId: string;
}

export const DispatchNotification = ({
  userName,
  userEmail,
  type,
  title,
  text,
  imageUrl,
  traceId,
}: DispatchNotificationProps) => (
  <Html>
    <Head />
    <Preview>[{type.toUpperCase()}] New Sanctuary Dispatch: {title}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerSection}>
           <Text style={monoLabel}>Incoming_Dispatch // {type}</Text>
           <Heading style={h1}>{title}</Heading>
        </Section>

        <Section style={contentSection}>
          <Text style={bodyText}>{text}</Text>
          
          {imageUrl && (
            <Section style={imageContainer}>
              <Img
                src={imageUrl}
                width="100%"
                alt="Evidence attached"
                style={evidenceImage}
              />
            </Section>
          )}
        </Section>

        <Hr style={hr} />

        <Section style={footer}>
          <Text style={footerText}>
            Sender: <strong>{userName}</strong> ({userEmail})
          </Text>
          <Text style={footerMono}>
            Trace_ID: {traceId}
          </Text>
          <Text style={brandText}>// withink. Archives</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default DispatchNotification;

const main = {
  backgroundColor: "#020617",
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
};

const container = {
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "560px",
};

const headerSection = {
  marginBottom: "32px",
};

const monoLabel = {
  color: "#6366f1", // primary/60 vibe
  fontSize: "10px",
  textTransform: "uppercase" as const,
  letterSpacing: "2px",
  margin: "0 0 12px 0",
};

const h1 = {
  color: "#f4f4f5",
  fontSize: "28px",
  fontWeight: "900",
  letterSpacing: "-1px",
  lineHeight: "1.2",
  margin: "0",
};

const contentSection = {
  backgroundColor: "#09090b",
  border: "1px solid #27272a",
  borderRadius: "16px",
  padding: "32px",
};

const bodyText = {
  color: "#a1a1aa",
  fontSize: "15px",
  lineHeight: "1.6",
  whiteSpace: "pre-wrap",
};

const imageContainer = {
  marginTop: "24px",
};

const evidenceImage = {
  borderRadius: "12px",
  border: "1px solid #27272a",
};

const hr = {
  borderColor: "#27272a",
  margin: "32px 0",
};

const footer = {
  textAlign: "left" as const,
};

const footerText = {
  color: "#71717a",
  fontSize: "13px",
  margin: "0 0 4px 0",
};

const footerMono = {
  color: "#3f3f46",
  fontSize: "11px",
  margin: "0 0 12px 0",
};

const brandText = {
  color: "#6366f1",
  fontSize: "10px",
  fontWeight: "bold",
  opacity: 0.5,
};