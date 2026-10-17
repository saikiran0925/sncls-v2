# Terraform AWS S3 + CloudFront Infrastructure

This directory contains Terraform scripts to spin up a cost-effective, high-performance static website hosting architecture on AWS for your React SPA.

## Resources Provisioned
- **AWS S3 Bucket**: Private S3 bucket to store `dist` build files.
- **AWS CloudFront Distribution**: Edge CDN with Origin Access Control (OAC), HTTPS enforcement, and SPA fallback (403/404 -> `/index.html`).
- **AWS ACM Certificate**: Free SSL certificate provisioned in `us-east-1` for your custom domain and subdomains.
- **S3 Bucket Policy**: Restricts direct S3 access so objects can *only* be read via CloudFront.

## Quick Start

### 1. Prerequisites
Ensure you have the AWS CLI and Terraform installed on your machine and configured with AWS credentials:
```bash
aws configure
```

### 2. Configure Variables
Copy `terraform.tfvars.example` to `terraform.tfvars` and set your domain name:
```bash
cp terraform.tfvars.example terraform.tfvars
```
Edit `terraform.tfvars`:
```hcl
domain_name = "yourdomain.com"
```

### 3. Initialize & Deploy Terraform
```bash
cd terraform
terraform init
terraform plan
terraform apply
```

### 4. Configure Namecheap DNS
After `terraform apply` finishes:
1. Check the output `acm_dns_validation_records` and add the CNAME host/value to **Namecheap Advanced DNS** to validate your SSL certificate.
2. Check the output `cloudfront_domain_name` (e.g. `d111111abcdef8.cloudfront.net`) and add:
   - **ALIAS Record**: Host `@` -> `d111111abcdef8.cloudfront.net`
   - **CNAME Record**: Host `www` -> `d111111abcdef8.cloudfront.net`
