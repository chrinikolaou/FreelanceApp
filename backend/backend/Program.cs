using backend.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using backend.Models;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Identity;
using backend.Evaluator;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<DataContext>(options=>options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnectionString")));



//GeorgeStart

builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();


builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
    };

    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            if (context.Request.Cookies.ContainsKey("jwt"))
            {
                context.Token = context.Request.Cookies["jwt"];
            }
            return Task.CompletedTask;
        }
    };
});


//GeorgeEnd



// Add services to the container.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost5173", policy =>
    {
        policy.WithOrigins("http://localhost:5173")  // Your frontend URL
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();  // Allow cookies (credentials)
    });
});

builder.Services.AddScoped<IQuoteEvaluator, QuoteEvaluatorService>();

var app = builder.Build();

// Enable access to requests for localhost:5173
app.UseCors("AllowLocalhost5173");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

//GeorgeStart
app.UseAuthentication();
//GeorgeEnd
app.UseAuthorization();

app.MapControllers();


app.Run();
